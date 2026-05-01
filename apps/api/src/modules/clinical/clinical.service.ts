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

    // Crea consent en estado PENDING. El ciudadano lo aprueba o rechaza desde su panel.
    const consent = await this.prisma.client.consent.create({
      data: {
        ciudadanoId: profile.userId,
        profesionalId: professional.id,
        scopes: dto.scopes as never,
        motivo: dto.motivo,
        status: 'PENDING',
      },
    });
    await this.audit.append({
      actorId: professionalUserId,
      actorRole: 'PROFESIONAL',
      action: 'CONSENT_GRANTED',
      targetType: 'Consent',
      targetId: consent.id,
      outcome: 'SUCCESS',
      payload: { scopes: dto.scopes, motivo: dto.motivo, status: 'requested' },
    });

    await this.notifications.dispatchMulti(
      {
        userId: profile.userId,
        category: 'CONSENT_REQUEST',
        title: 'Solicitud de acceso clínico',
        body: `Dr/a. ${professional.nombre} ${professional.apellido} (M.N. ${professional.matriculaNacional ?? '—'}) solicita acceso a tu perfil clínico para: "${dto.motivo}". Aprobá o rechazá desde tu panel de consentimientos.`,
        payload: {
          consentId: consent.id,
          actionUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/panel/consentimientos`,
        },
      },
      ['EMAIL', 'IN_APP'],
    );

    return consent;
  }

  /**
   * El ciudadano responde a una solicitud de consent: aprobar o rechazar.
   */
  async respondConsent(
    citizenUserId: string,
    consentId: string,
    decision: 'APPROVE' | 'REJECT',
    opts: { rejectionReason?: string; durationDays?: number },
  ) {
    const consent = await this.prisma.client.consent.findUnique({ where: { id: consentId } });
    if (!consent) throw new NotFoundException('Solicitud no encontrada.');
    if (consent.ciudadanoId !== citizenUserId) {
      throw new ForbiddenException('No es tu solicitud.');
    }
    if (consent.status !== 'PENDING') {
      throw new BadRequestException(`La solicitud ya fue ${consent.status.toLowerCase()}.`);
    }

    if (decision === 'REJECT') {
      const updated = await this.prisma.client.consent.update({
        where: { id: consentId },
        data: {
          status: 'REJECTED',
          rejectionReason: opts.rejectionReason ?? null,
          revokedAt: new Date(),
        },
      });
      await this.audit.append({
        actorId: citizenUserId,
        actorRole: 'CIUDADANO',
        action: 'CONSENT_REVOKED',
        targetType: 'Consent',
        targetId: consentId,
        outcome: 'SUCCESS',
        payload: { decision: 'rejected', reason: opts.rejectionReason ?? null },
      });
      return updated;
    }

    const days = opts.durationDays ?? 30;
    const expiresAt = new Date(Date.now() + days * 24 * 3600 * 1000);
    const updated = await this.prisma.client.consent.update({
      where: { id: consentId },
      data: {
        status: 'APPROVED',
        grantedAt: new Date(),
        expiresAt,
      },
    });
    await this.audit.append({
      actorId: citizenUserId,
      actorRole: 'CIUDADANO',
      action: 'CONSENT_GRANTED',
      targetType: 'Consent',
      targetId: consentId,
      outcome: 'SUCCESS',
      payload: { decision: 'approved', durationDays: days },
    });

    // Notificar al profesional que ya tiene acceso.
    if (consent.profesionalId) {
      const professional = await this.prisma.client.professionalProfile.findUnique({
        where: { id: consent.profesionalId },
        select: { userId: true, nombre: true, apellido: true },
      });
      if (professional) {
        await this.notifications.dispatch({
          userId: professional.userId,
          channel: 'IN_APP',
          category: 'CONSENT_GRANTED',
          title: 'Acceso clínico aprobado',
          body: `El paciente aprobó tu solicitud por ${days} días. Ya podés ver su perfil clínico.`,
          payload: { consentId, actionUrl: '/portal-profesional/buscar' },
        });
      }
    }

    return updated;
  }

  /**
   * Ciudadano revoca un consent vigente.
   */
  async revokeConsent(citizenUserId: string, consentId: string) {
    const consent = await this.prisma.client.consent.findUnique({ where: { id: consentId } });
    if (!consent) throw new NotFoundException('Consent no encontrado.');
    if (consent.ciudadanoId !== citizenUserId) {
      throw new ForbiddenException('No es tu consent.');
    }
    if (consent.status !== 'APPROVED') {
      throw new BadRequestException(`No podés revocar un consent en estado ${consent.status}.`);
    }
    const updated = await this.prisma.client.consent.update({
      where: { id: consentId },
      data: { status: 'REVOKED', revokedAt: new Date() },
    });
    await this.audit.append({
      actorId: citizenUserId,
      actorRole: 'CIUDADANO',
      action: 'CONSENT_REVOKED',
      targetType: 'Consent',
      targetId: consentId,
      outcome: 'SUCCESS',
      payload: { reason: 'self_revoked' },
    });
    return updated;
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
        status: 'APPROVED',
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      orderBy: { grantedAt: 'desc' },
    });
  }
}
