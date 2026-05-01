import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';

interface RequestCtx {
  ip: string | null;
  userAgent: string | null;
}

@Injectable()
export class ClinicalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly notifications: NotificationsService,
  ) {}

  async searchByDni(professionalUserId: string, dni: string, ctx: RequestCtx) {
    if (!dni || !/^\d{7,9}$/.test(dni)) {
      throw new BadRequestException('DNI inválido. Solo números, sin puntos.');
    }
    const profile = await this.prisma.client.citizenProfile.findUnique({ where: { dni } });
    if (!profile) {
      return { found: false, reason: 'NOT_FOUND' as const };
    }
    const consent = await this.findVigentConsent(professionalUserId, profile.userId);
    if (!consent) {
      // Devolvemos mínimo (existencia + nombre parcial) para que el profesional pueda solicitar consent.
      return {
        found: true,
        consent_required: true,
        ciudadano: {
          id: profile.id,
          dni: profile.dni,
          nombre: profile.nombre.split(' ')[0],
          inicial: profile.apellido[0]?.toUpperCase() ?? '',
        },
      };
    }
    await this.audit.append({
      actorId: professionalUserId,
      actorRole: 'PROFESIONAL',
      action: 'PROFILE_VIEW',
      targetType: 'CitizenProfile',
      targetId: profile.id,
      outcome: 'SUCCESS',
      ip: ctx.ip,
      userAgent: ctx.userAgent,
      payload: { consentId: consent.id },
    });
    return {
      found: true,
      consent_required: false,
      ciudadano: profile,
      consent,
    };
  }

  async timelineByCitizenId(professionalUserId: string, citizenProfileId: string, ctx: RequestCtx) {
    const profile = await this.prisma.client.citizenProfile.findUnique({
      where: { id: citizenProfileId },
    });
    if (!profile) throw new NotFoundException('Paciente no encontrado.');
    const consent = await this.findVigentConsent(professionalUserId, profile.userId);
    if (!consent || !consent.scopes.includes('TIMELINE_CLINICO')) {
      throw new ForbiddenException('No tenés consentimiento vigente para ver el timeline.');
    }
    const records = await this.prisma.client.clinicalRecord.findMany({
      where: { ciudadanoId: profile.id },
      orderBy: { ocurridoEn: 'desc' },
      take: 50,
      include: {
        profesional: { select: { nombre: true, apellido: true, especialidades: true } },
        institucion: { select: { razonSocial: true, fantasyName: true } },
      },
    });
    await this.audit.append({
      actorId: professionalUserId,
      actorRole: 'PROFESIONAL',
      action: 'CLINICAL_RECORD_VIEWED',
      targetType: 'CitizenProfile',
      targetId: profile.id,
      outcome: 'SUCCESS',
      ip: ctx.ip,
      userAgent: ctx.userAgent,
      payload: { count: records.length, consentId: consent.id },
    });
    return records;
  }

  async createEvolucion(
    professionalUserId: string,
    dto: { ciudadanoId: string; tipo: string; titulo: string; descripcion?: string },
    ctx: RequestCtx,
  ) {
    const profile = await this.prisma.client.citizenProfile.findUnique({
      where: { id: dto.ciudadanoId },
    });
    if (!profile) throw new NotFoundException('Paciente no encontrado.');
    const consent = await this.findVigentConsent(professionalUserId, profile.userId);
    if (!consent || !consent.scopes.includes('CARGA_EVOLUCION')) {
      throw new ForbiddenException('No tenés consentimiento vigente para cargar evolución.');
    }
    const professional = await this.prisma.client.professionalProfile.findUnique({
      where: { userId: professionalUserId },
    });
    if (!professional) throw new ForbiddenException('No tenés perfil profesional cargado.');

    const record = await this.prisma.client.clinicalRecord.create({
      data: {
        ciudadanoId: profile.id,
        profesionalId: professional.id,
        tipo: dto.tipo as never,
        titulo: dto.titulo,
        descripcion: dto.descripcion,
        ocurridoEn: new Date(),
      },
    });
    await this.audit.append({
      actorId: professionalUserId,
      actorRole: 'PROFESIONAL',
      action: 'CLINICAL_RECORD_CREATED',
      targetType: 'ClinicalRecord',
      targetId: record.id,
      outcome: 'SUCCESS',
      ip: ctx.ip,
      userAgent: ctx.userAgent,
      payload: { tipo: dto.tipo },
    });

    await this.notifications.dispatch({
      userId: profile.userId,
      channel: 'IN_APP',
      category: 'CLINICAL_RECORD_ADDED',
      title: 'Nuevo registro clínico en tu Pulso ID',
      body: `Dr/a. ${professional.nombre} ${professional.apellido} cargó "${dto.titulo}" en tu historia clínica.`,
      payload: { recordId: record.id, actionUrl: '/panel/historial' },
    });

    return record;
  }

  async requestConsent(
    professionalUserId: string,
    dto: { ciudadanoDni: string; scopes: string[]; motivo: string },
  ) {
    const profile = await this.prisma.client.citizenProfile.findUnique({
      where: { dni: dto.ciudadanoDni },
    });
    if (!profile) throw new NotFoundException('Paciente no encontrado.');
    const professional = await this.prisma.client.professionalProfile.findUnique({
      where: { userId: professionalUserId },
    });
    if (!professional) throw new ForbiddenException('Falta tu perfil profesional.');

    // Crea un consent en estado pendiente — en prod requeriría confirmación del ciudadano.
    // Por ahora MVP: crea consent vigente por 7 días para demos. Codex debería:
    //   1. Cambiar a "ConsentRequest" con estado PENDING.
    //   2. Notificar push/email al ciudadano.
    //   3. Permitir confirmación/rechazo.
    const consent = await this.prisma.client.consent.create({
      data: {
        ciudadanoId: profile.userId,
        profesionalId: professional.id,
        scopes: dto.scopes as never,
        motivo: dto.motivo,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });
    await this.audit.append({
      actorId: professionalUserId,
      actorRole: 'PROFESIONAL',
      action: 'CONSENT_GRANTED',
      targetType: 'Consent',
      targetId: consent.id,
      outcome: 'SUCCESS',
      payload: { scopes: dto.scopes, motivo: dto.motivo, demo: true },
    });

    await this.notifications.dispatchMulti(
      {
        userId: profile.userId,
        category: 'CONSENT_GRANTED',
        title: 'Acceso clínico autorizado',
        body: `Dr/a. ${professional.nombre} ${professional.apellido} (M.N. ${professional.matriculaNacional ?? '—'}) ya tiene acceso a tu perfil clínico para: ${dto.motivo}. Podés revocar el acceso desde tu panel de consentimientos.`,
        payload: {
          consentId: consent.id,
          actionUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/panel/consentimientos`,
        },
      },
      ['EMAIL', 'IN_APP'],
    );

    return consent;
  }

  private async findVigentConsent(professionalUserId: string, citizenUserId: string) {
    const professional = await this.prisma.client.professionalProfile.findUnique({
      where: { userId: professionalUserId },
    });
    if (!professional) return null;
    return this.prisma.client.consent.findFirst({
      where: {
        ciudadanoId: citizenUserId,
        profesionalId: professional.id,
        revokedAt: null,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      orderBy: { grantedAt: 'desc' },
    });
  }
}
