import { Injectable } from '@nestjs/common';
import type { EmergencyPublicView } from '@pulso/types';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';

interface AccessContext {
  ip: string | null;
  userAgent: string | null;
}

@Injectable()
export class EmergencyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async accessByToken(token: string, ctx: AccessContext): Promise<EmergencyPublicView | null> {
    const qr = await this.prisma.client.emergencyAccess.findUnique({
      where: { token },
      include: {
        user: {
          include: { citizenProfile: true },
        },
      },
    });

    if (!qr) return null;
    if (qr.revokedAt) return null;
    if (qr.expiresAt && qr.expiresAt < new Date()) return null;
    if (!qr.user.citizenProfile) return null;

    const profile = qr.user.citizenProfile;

    // Registramos el acceso (sync con audit log + log específico de emergencia).
    await this.prisma.client.emergencyAccessLog.create({
      data: {
        emergencyAccessId: qr.id,
        ip: ctx.ip,
        userAgent: ctx.userAgent,
      },
    });
    await this.audit.append({
      actorId: null,
      actorRole: null,
      action: 'EMERGENCY_QR_ACCESSED',
      targetType: 'EmergencyAccess',
      targetId: qr.id,
      outcome: 'SUCCESS',
      ip: ctx.ip,
      userAgent: ctx.userAgent,
      payload: { ciudadanoId: qr.userId },
    });

    const edad = calcularEdad(profile.fechaNacimiento);

    const alergias = (profile.alergias as Array<{ sustancia: string; severidad: string }>).map(
      (a) => `${a.sustancia} (${a.severidad.toLowerCase()})`,
    );
    const condiciones = (profile.condicionesCriticas as Array<{ nombre: string }>).map(
      (c) => c.nombre,
    );
    const medicacion = (profile.medicacionHabitual as Array<{ nombre: string; presentacion?: string; posologia?: string }>).map(
      (m) => `${m.nombre}${m.presentacion ? ' · ' + m.presentacion : ''}${m.posologia ? ' · ' + m.posologia : ''}`,
    );

    const ce = profile.contactoEmergencia as
      | { nombre: string; telefono: string; relacion: string }
      | null
      | undefined;
    const cob = profile.cobertura as
      | { tipo: string; obraSocial?: string; numeroAfiliado?: string; prepaga?: string }
      | null
      | undefined;

    return {
      nombre: profile.nombre,
      apellido: profile.apellido,
      edad,
      grupoSanguineo: profile.grupoSanguineo,
      alergias,
      condicionesCriticas: condiciones,
      medicacionHabitual: medicacion,
      contactoEmergencia: ce
        ? { nombre: ce.nombre, telefono: ce.telefono, relacion: ce.relacion }
        : null,
      cobertura: cob
        ? {
            tipo: cob.tipo,
            obraSocial: cob.obraSocial ?? cob.prepaga ?? null,
            numeroAfiliado: cob.numeroAfiliado ?? null,
          }
        : null,
      emitidoEn: qr.createdAt.toISOString(),
    };
  }
}

function calcularEdad(fechaNac: Date): number {
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const m = hoy.getMonth() - fechaNac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) edad--;
  return edad;
}
