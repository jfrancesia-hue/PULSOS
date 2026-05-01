import { Controller, Delete, Get, NotFoundException, Param, ForbiddenException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type AuthContext } from '../../common/auth';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth/sessions')
export class SessionsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  /** Lista los refresh tokens vigentes del usuario actual. */
  @Get()
  async list(@CurrentUser() user: AuthContext) {
    const sessions = await this.prisma.client.refreshToken.findMany({
      where: {
        userId: user.userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        ip: true,
        userAgent: true,
        createdAt: true,
        expiresAt: true,
      },
    });
    return sessions.map((s) => ({
      ...s,
      label: humanizeUserAgent(s.userAgent),
    }));
  }

  /** Revoca un refresh token específico (cierra sesión en ese dispositivo). */
  @Delete(':id')
  async revoke(@CurrentUser() user: AuthContext, @Param('id') id: string) {
    const session = await this.prisma.client.refreshToken.findUnique({ where: { id } });
    if (!session) throw new NotFoundException('Sesión no encontrada.');
    if (session.userId !== user.userId) throw new ForbiddenException('No es tu sesión.');
    if (session.revokedAt) return { ok: true, alreadyRevoked: true };

    await this.prisma.client.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
    await this.audit.append({
      actorId: user.userId,
      actorRole: user.role,
      action: 'AUTH_LOGOUT',
      targetType: 'RefreshToken',
      targetId: id,
      outcome: 'SUCCESS',
      payload: { reason: 'session_revoked_by_user' },
    });
    return { ok: true };
  }

  /** Revoca todas las sesiones excepto la actual (no podemos identificar la actual sin el token plano, así que revoca todas). */
  @Delete()
  async revokeAll(@CurrentUser() user: AuthContext) {
    const result = await this.prisma.client.refreshToken.updateMany({
      where: { userId: user.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    await this.audit.append({
      actorId: user.userId,
      actorRole: user.role,
      action: 'AUTH_LOGOUT',
      targetType: 'RefreshToken',
      targetId: null,
      outcome: 'SUCCESS',
      payload: { reason: 'all_sessions_revoked', count: result.count },
    });
    return { ok: true, revoked: result.count };
  }
}

function humanizeUserAgent(ua: string | null): string {
  if (!ua) return 'Dispositivo desconocido';
  const lower = ua.toLowerCase();
  if (lower.includes('iphone')) return 'iPhone · Safari';
  if (lower.includes('ipad')) return 'iPad · Safari';
  if (lower.includes('android')) return 'Android · ' + (lower.includes('chrome') ? 'Chrome' : 'Browser');
  if (lower.includes('mac')) return 'Mac · ' + matchBrowser(lower);
  if (lower.includes('windows')) return 'Windows · ' + matchBrowser(lower);
  if (lower.includes('linux')) return 'Linux · ' + matchBrowser(lower);
  return 'Navegador';
}

function matchBrowser(ua: string): string {
  if (ua.includes('edge') || ua.includes('edg/')) return 'Edge';
  if (ua.includes('chrome')) return 'Chrome';
  if (ua.includes('firefox')) return 'Firefox';
  if (ua.includes('safari')) return 'Safari';
  return 'Navegador';
}
