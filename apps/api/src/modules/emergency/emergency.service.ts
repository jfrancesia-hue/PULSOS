import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import type { EmergencyPublicView } from '@pulso/types';
import { TTL_TO_SECONDS, type EmergencyTtl } from '@pulso/types';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';

interface AccessContext {
  ip: string | null;
  userAgent: string | null;
}

@Injectable()
export class EmergencyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly notifications: NotificationsService,
  ) {}

  async accessByToken(token: string, ctx: AccessContext): Promise<EmergencyPublicView | null> {
    const qr = await this.prisma.client.emergencyAccess.findUnique({
      where: { token },
      include: {
        user: { include: { citizenProfile: true } },
      },
    });

    if (!qr) return null;
    if (qr.revokedAt) return null;
    if (qr.expiresAt && qr.expiresAt < new Date()) return null;
    if (!qr.user.citizenProfile) return null;

    const profile = qr.user.citizenProfile;

    const log = await this.prisma.client.emergencyAccessLog.create({
      data: {
        emergencyAccessId: qr.id,
        ip: ctx.ip,
        userAgent: ctx.userAgent,
        notifiedAt: new Date(),
      },
    });

    // Notificación al ciudadano: sabe en tiempo real que alguien accedió a su QR.
    await this.notifications.dispatch({
      userId: qr.userId,
      channel: 'EMAIL',
      category: 'EMERGENCY_QR_ACCESSED',
      title: '🚨 Acceso a tu QR de emergencia',
      body: `Alguien acaba de escanear tu QR de emergencia${ctx.ip ? ` desde la IP ${ctx.ip}` : ''}. Si no estás en una emergencia o no autorizaste este acceso, te recomendamos revocar el QR desde tu panel.`,
      payload: {
        actionUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/panel/historial`,
        accessLogId: log.id,
      },
    });
    await this.notifications.dispatch({
      userId: qr.userId,
      channel: 'IN_APP',
      category: 'EMERGENCY_QR_ACCESSED',
      title: 'Acceso a tu QR de emergencia',
      body: ctx.ip ? `Acceso desde IP ${ctx.ip}` : 'Acceso registrado',
      payload: { accessLogId: log.id },
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
    const medicacion = (
      profile.medicacionHabitual as Array<{ nombre: string; presentacion?: string; posologia?: string }>
    ).map(
      (m) =>
        `${m.nombre}${m.presentacion ? ' · ' + m.presentacion : ''}${m.posologia ? ' · ' + m.posologia : ''}`,
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

  listByUser(userId: string) {
    return this.prisma.client.emergencyAccess.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { logs: true } } },
    });
  }

  async create(userId: string, ttl: EmergencyTtl) {
    const ttlSeconds = TTL_TO_SECONDS[ttl];
    const expiresAt = ttlSeconds ? new Date(Date.now() + ttlSeconds * 1000) : null;
    const token = randomBytes(24).toString('hex');
    const qr = await this.prisma.client.emergencyAccess.create({
      data: { userId, token, ttl, expiresAt },
    });
    await this.audit.append({
      actorId: userId,
      actorRole: 'CIUDADANO',
      action: 'EMERGENCY_QR_GENERATED',
      targetType: 'EmergencyAccess',
      targetId: qr.id,
      outcome: 'SUCCESS',
      payload: { ttl },
    });
    return qr;
  }

  async revoke(userId: string, qrId: string) {
    const qr = await this.prisma.client.emergencyAccess.findUnique({ where: { id: qrId } });
    if (!qr) throw new NotFoundException('QR no encontrado.');
    if (qr.userId !== userId) throw new ForbiddenException('No es tu QR.');
    const updated = await this.prisma.client.emergencyAccess.update({
      where: { id: qrId },
      data: { revokedAt: new Date() },
    });
    await this.audit.append({
      actorId: userId,
      actorRole: 'CIUDADANO',
      action: 'EMERGENCY_QR_REVOKED',
      targetType: 'EmergencyAccess',
      targetId: qrId,
      outcome: 'SUCCESS',
      payload: {},
    });
    return updated;
  }

  async logsForUser(userId: string, qrId: string) {
    const qr = await this.prisma.client.emergencyAccess.findUnique({ where: { id: qrId } });
    if (!qr) throw new NotFoundException('QR no encontrado.');
    if (qr.userId !== userId) throw new ForbiddenException('No es tu QR.');
    return this.prisma.client.emergencyAccessLog.findMany({
      where: { emergencyAccessId: qrId },
      orderBy: { accessedAt: 'desc' },
      take: 100,
    });
  }
}

function calcularEdad(fechaNac: Date): number {
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const m = hoy.getMonth() - fechaNac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) edad--;
  return edad;
}
