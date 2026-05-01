import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash } from 'node:crypto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import type { AuthContext } from '../../common/auth';

interface IssueInput {
  ciudadanoDni: string;
  diagnostico?: string;
  notas?: string;
  items: Array<{
    medicacion: string;
    presentacion?: string;
    posologia: string;
    cantidad?: string;
    duracionDias?: number;
    observaciones?: string;
  }>;
  validezDias?: number;
}

@Injectable()
export class PrescriptionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly notifications: NotificationsService,
  ) {}

  async issue(professionalUserId: string, input: IssueInput) {
    const professional = await this.prisma.client.professionalProfile.findUnique({
      where: { userId: professionalUserId },
    });
    if (!professional) {
      throw new ForbiddenException('No tenés perfil profesional cargado.');
    }
    const profile = await this.prisma.client.citizenProfile.findUnique({
      where: { dni: input.ciudadanoDni },
    });
    if (!profile) {
      throw new NotFoundException('Paciente no encontrado por DNI.');
    }
    const consent = await this.prisma.client.consent.findFirst({
      where: {
        ciudadanoId: profile.userId,
        profesionalId: professional.id,
        revokedAt: null,
        scopes: { has: 'CARGA_EVOLUCION' },
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    });
    if (!consent) {
      throw new ForbiddenException(
        'Necesitás consentimiento vigente con scope CARGA_EVOLUCION para emitir recetas.',
      );
    }

    const validezDias = input.validezDias ?? 30;
    if (validezDias < 1 || validezDias > 365) {
      throw new BadRequestException('validezDias debe estar entre 1 y 365.');
    }
    const validaHasta = new Date(Date.now() + validezDias * 24 * 3600 * 1000);

    // Hash de firma: identifica unívocamente la receta y permite verificación.
    const signaturePayload = JSON.stringify({
      profesional: professional.id,
      ciudadano: profile.userId,
      items: input.items,
      diagnostico: input.diagnostico ?? null,
      emitida: new Date().toISOString(),
    });
    const signatureHash = createHash('sha256').update(signaturePayload).digest('hex');

    const prescription = await this.prisma.client.prescription.create({
      data: {
        ciudadanoId: profile.userId,
        profesionalId: professional.id,
        diagnostico: input.diagnostico,
        notas: input.notas,
        emitidaEn: new Date(),
        validaHasta,
        signatureHash,
        items: {
          create: input.items.map((i) => ({
            medicacion: i.medicacion,
            presentacion: i.presentacion,
            posologia: i.posologia,
            cantidad: i.cantidad,
            duracionDias: i.duracionDias,
            observaciones: i.observaciones,
          })),
        },
      },
      include: { items: true },
    });

    await this.audit.append({
      actorId: professionalUserId,
      actorRole: 'PROFESIONAL',
      action: 'CLINICAL_RECORD_CREATED',
      targetType: 'Prescription',
      targetId: prescription.id,
      outcome: 'SUCCESS',
      payload: { itemCount: input.items.length, validezDias },
    });

    await this.notifications.dispatch({
      userId: profile.userId,
      channel: 'IN_APP',
      category: 'PRESCRIPTION_ISSUED',
      title: 'Tenés una receta digital nueva',
      body: `Dr/a. ${professional.nombre} ${professional.apellido} te emitió una receta con ${input.items.length} ítem${input.items.length !== 1 ? 's' : ''}. Válida hasta ${validaHasta.toLocaleDateString('es-AR')}.`,
      payload: { prescriptionId: prescription.id, actionUrl: `/panel/recetas/${prescription.id}` },
    });
    await this.notifications.dispatch({
      userId: profile.userId,
      channel: 'EMAIL',
      category: 'PRESCRIPTION_ISSUED',
      title: 'Receta digital de Pulso',
      body: `Hola ${profile.nombre}, Dr/a. ${professional.nombre} ${professional.apellido} te emitió una receta. Vencimiento: ${validaHasta.toLocaleDateString('es-AR')}.`,
      payload: {
        actionUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/panel/recetas/${prescription.id}`,
      },
    });

    return prescription;
  }

  async listForCitizen(citizenUserId: string) {
    return this.prisma.client.prescription.findMany({
      where: { ciudadanoId: citizenUserId },
      orderBy: { emitidaEn: 'desc' },
      include: {
        items: true,
        profesional: { select: { nombre: true, apellido: true, matriculaNacional: true } },
      },
    });
  }

  async get(actor: AuthContext, id: string) {
    const p = await this.prisma.client.prescription.findUnique({
      where: { id },
      include: {
        items: true,
        profesional: { select: { nombre: true, apellido: true, matriculaNacional: true, especialidades: true } },
        institucion: { select: { razonSocial: true, fantasyName: true } },
      },
    });
    if (!p) throw new NotFoundException('Receta no encontrada.');
    const allowed =
      p.ciudadanoId === actor.userId ||
      actor.role === 'FARMACIA' ||
      actor.role === 'ADMIN' ||
      actor.role === 'SUPERADMIN' ||
      (actor.role === 'PROFESIONAL' && (await this.isOwnerProfessional(actor.userId, p.profesionalId)));
    if (!allowed) throw new ForbiddenException('No tenés permiso para ver esta receta.');
    return p;
  }

  async dispense(pharmacyUserId: string, id: string) {
    const p = await this.prisma.client.prescription.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Receta no encontrada.');
    if (p.status === 'DISPENSADA' || p.status === 'ANULADA') {
      throw new BadRequestException(`Receta en estado ${p.status} — no se puede dispensar.`);
    }
    if (p.validaHasta < new Date()) {
      await this.prisma.client.prescription.update({
        where: { id },
        data: { status: 'EXPIRADA' },
      });
      throw new BadRequestException('Receta expirada.');
    }
    const updated = await this.prisma.client.prescription.update({
      where: { id },
      data: { status: 'DISPENSADA', dispensadaEn: new Date() },
    });
    await this.audit.append({
      actorId: pharmacyUserId,
      actorRole: 'FARMACIA',
      action: 'CLINICAL_RECORD_VIEWED',
      targetType: 'Prescription',
      targetId: id,
      outcome: 'SUCCESS',
      payload: { event: 'dispensed' },
    });
    return updated;
  }

  private async isOwnerProfessional(userId: string, profesionalId: string): Promise<boolean> {
    const p = await this.prisma.client.professionalProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    return p?.id === profesionalId;
  }
}
