import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { hashPassword, signAccessToken, signRefreshToken, verifyPassword } from '@pulso/auth';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';
import type { LoginDto, SignupDto } from './auth.dto';

interface RequestContext {
  ip: string | null;
  userAgent: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async signup(dto: SignupDto, ctx: RequestContext) {
    const existing = await this.prisma.client.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Ya existe una cuenta con ese email.');
    }
    const passwordHash = await hashPassword(dto.password);
    const user = await this.prisma.client.user.create({
      data: {
        email: dto.email,
        passwordHash,
        role: 'CIUDADANO',
        status: 'PENDING_VERIFICATION',
      },
    });
    return this.issueTokens(user.id, user.role, false, ctx);
  }

  async login(dto: LoginDto, ctx: RequestContext) {
    const user = await this.prisma.client.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      await this.audit.append({
        actorId: null,
        actorRole: null,
        action: 'AUTH_LOGIN_FAILURE',
        targetType: 'User',
        targetId: null,
        outcome: 'FAILURE',
        ip: ctx.ip,
        userAgent: ctx.userAgent,
        payload: { reason: 'unknown_email' },
      });
      throw new UnauthorizedException('Credenciales inválidas.');
    }
    const ok = await verifyPassword(dto.password, user.passwordHash);
    if (!ok) {
      await this.prisma.client.user.update({
        where: { id: user.id },
        data: { failedLoginCount: { increment: 1 } },
      });
      await this.audit.append({
        actorId: user.id,
        actorRole: user.role,
        action: 'AUTH_LOGIN_FAILURE',
        targetType: 'User',
        targetId: user.id,
        outcome: 'FAILURE',
        ip: ctx.ip,
        userAgent: ctx.userAgent,
        payload: { reason: 'wrong_password' },
      });
      throw new UnauthorizedException('Credenciales inválidas.');
    }
    await this.prisma.client.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), failedLoginCount: 0 },
    });
    await this.audit.append({
      actorId: user.id,
      actorRole: user.role,
      action: 'AUTH_LOGIN_SUCCESS',
      targetType: 'User',
      targetId: user.id,
      outcome: 'SUCCESS',
      ip: ctx.ip,
      userAgent: ctx.userAgent,
      payload: {},
    });
    return this.issueTokens(user.id, user.role, user.mfaEnabled, ctx);
  }

  private async issueTokens(
    userId: string,
    role: string,
    mfaSatisfied: boolean,
    _ctx: RequestContext,
  ) {
    const access = await signAccessToken({ sub: userId, role: role as never, mfaSatisfied });
    const refresh = await signRefreshToken({ sub: userId, role: role as never });
    return {
      ok: true,
      data: { accessToken: access, refreshToken: refresh, role, mfaRequired: !mfaSatisfied && (role === 'ADMIN' || role === 'SUPERADMIN') },
    };
  }
}
