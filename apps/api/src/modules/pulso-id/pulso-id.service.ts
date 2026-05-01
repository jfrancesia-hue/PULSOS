import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';
import type {
  AlergiaItem,
  MedicacionItem,
  CondicionItem,
  UpdateProfileDto,
  UpdateContactoDto,
  UpdateCoberturaDto,
} from './pulso-id.dto';

interface RequestCtx {
  ip: string | null;
  userAgent: string | null;
}

@Injectable()
export class PulsoIdService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async getMyProfile(userId: string, ctx: RequestCtx) {
    const profile = await this.prisma.client.citizenProfile.findUnique({
      where: { userId },
    });
    if (profile) {
      await this.audit.append({
        actorId: userId,
        actorRole: 'CIUDADANO',
        action: 'PROFILE_VIEW',
        targetType: 'CitizenProfile',
        targetId: profile.id,
        outcome: 'SUCCESS',
        ip: ctx.ip,
        userAgent: ctx.userAgent,
        payload: {},
      });
    }
    return profile;
  }

  updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.persist(userId, { ...dto }, { type: 'profile_basic' });
  }

  updateAlergias(userId: string, alergias: AlergiaItem[]) {
    return this.persist(userId, { alergias: alergias as never }, { type: 'alergias', count: alergias.length });
  }

  updateMedicacion(userId: string, medicacion: MedicacionItem[]) {
    return this.persist(
      userId,
      { medicacionHabitual: medicacion as never },
      { type: 'medicacion', count: medicacion.length },
    );
  }

  updateCondiciones(userId: string, condiciones: CondicionItem[]) {
    return this.persist(
      userId,
      { condicionesCriticas: condiciones as never },
      { type: 'condiciones', count: condiciones.length },
    );
  }

  updateContacto(userId: string, dto: UpdateContactoDto) {
    return this.persist(
      userId,
      { contactoEmergencia: dto as never },
      { type: 'contacto_emergencia' },
    );
  }

  updateCobertura(userId: string, dto: UpdateCoberturaDto) {
    return this.persist(userId, { cobertura: dto as never }, { type: 'cobertura' });
  }

  async listDocuments(userId: string) {
    const profile = await this.prisma.client.citizenProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile) return [];
    return this.prisma.client.clinicalDocument.findMany({
      where: { ciudadanoId: profile.id },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async listConsents(userId: string) {
    return this.prisma.client.consent.findMany({
      where: { ciudadanoId: userId },
      orderBy: { grantedAt: 'desc' },
      include: {
        profesional: { select: { nombre: true, apellido: true, matriculaNacional: true } },
        institucion: { select: { razonSocial: true, fantasyName: true } },
      },
    });
  }

  private async persist(userId: string, data: Record<string, unknown>, payload: Record<string, unknown>) {
    const updated = await this.prisma.client.citizenProfile.update({
      where: { userId },
      data,
    });
    await this.audit.append({
      actorId: userId,
      actorRole: 'CIUDADANO',
      action: 'PROFILE_UPDATE',
      targetType: 'CitizenProfile',
      targetId: updated.id,
      outcome: 'SUCCESS',
      payload,
    });
    return updated;
  }
}
