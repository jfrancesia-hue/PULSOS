import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  buildOtpAuthUrl,
  generateMfaSecret,
  hashPassword,
  hashToken,
  issueOneTimeToken,
  signAccessToken,
  signRefreshToken,
  verifyMfaToken,
  verifyPassword,
  verifyToken,
} from '@pulso/auth';
import type { Role } from '@pulso/types';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import type { LoginDto, SignupDto } from './auth.dto';

interface RequestContext {
  ip: string | null;
  userAgent: string | null;
}

const EMAIL_TOKEN_TTL_HOURS = 24;
const PASSWORD_RESET_TTL_HOURS = 1;
const REFRESH_TTL_DAYS = 14;
const MAX_FAILED_LOGINS = 5;
const LOCK_DURATION_MIN = 15;

@Injectable()
export class AuthService {
  private readonly logger = new Logger('Auth');
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly notifications: NotificationsService,
  ) {}

  async signup(dto: SignupDto, ctx: RequestContext) {
    const existing = await this.prisma.client.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Ya existe una cuenta con ese email.');
    }
    const dniExists = await this.prisma.client.citizenProfile.findUnique({
      where: { dni: dto.dni },
    });
    if (dniExists) {
      throw new ConflictException('Ya hay una cuenta con ese DNI.');
    }

    const passwordHash = await hashPassword(dto.password);

    const user = await this.prisma.client.user.create({
      data: {
        email: dto.email,
        passwordHash,
        role: 'CIUDADANO',
        status: 'PENDING_VERIFICATION',
        citizenProfile: {
          create: {
            dni: dto.dni,
            nombre: dto.nombre,
            apellido: dto.apellido,
            fechaNacimiento: new Date(dto.fechaNacimiento),
            sexoBiologico: dto.sexoBiologico as never,
            provincia: dto.provincia as never,
            localidad: dto.localidad,
            telefono: dto.telefono,
          },
        },
      },
    });

    const verifyTok = issueOneTimeToken();
    await this.prisma.client.emailVerificationToken.create({
      data: {
        userId: user.id,
        tokenHash: verifyTok.hash,
        expiresAt: new Date(Date.now() + EMAIL_TOKEN_TTL_HOURS * 3600 * 1000),
      },
    });

    await this.notifications.dispatch({
      userId: user.id,
      channel: 'EMAIL',
      category: 'EMAIL_VERIFICATION',
      title: 'Verificá tu cuenta de Pulso',
      body: `Hola ${dto.nombre}, gracias por crear tu Pulso ID. Verificá tu email haciendo click en el siguiente enlace (válido ${EMAIL_TOKEN_TTL_HOURS} horas):`,
      payload: {
        verifyUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/verificar-email?token=${verifyTok.plain}`,
      },
    });

    await this.notifications.dispatch({
      userId: user.id,
      channel: 'IN_APP',
      category: 'WELCOME',
      title: '¡Bienvenido/a a Pulso!',
      body: 'Tu Pulso ID está listo. Te recomendamos completar tu perfil clínico (alergias, medicación, condiciones) para que tu QR de emergencia tenga toda tu información crítica.',
    });

    await this.audit.append({
      actorId: user.id,
      actorRole: 'CIUDADANO',
      action: 'AUTH_LOGIN_SUCCESS',
      targetType: 'User',
      targetId: user.id,
      outcome: 'SUCCESS',
      ip: ctx.ip,
      userAgent: ctx.userAgent,
      payload: { event: 'signup' },
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
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException(
        `Cuenta bloqueada hasta ${user.lockedUntil.toISOString()}. Probá más tarde o reseteá la contraseña.`,
      );
    }
    if (user.status === 'SUSPENDED' || user.status === 'DELETED') {
      throw new UnauthorizedException('Cuenta inactiva. Contactá al administrador.');
    }

    const ok = user.passwordHash.startsWith('scrypt$')
      ? this.verifyScrypt(dto.password, user.passwordHash)
      : await verifyPassword(dto.password, user.passwordHash);

    if (!ok) {
      const newFailed = user.failedLoginCount + 1;
      const shouldLock = newFailed >= MAX_FAILED_LOGINS;
      await this.prisma.client.user.update({
        where: { id: user.id },
        data: {
          failedLoginCount: newFailed,
          lockedUntil: shouldLock ? new Date(Date.now() + LOCK_DURATION_MIN * 60 * 1000) : null,
        },
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
        payload: { reason: 'wrong_password', failedCount: newFailed, locked: shouldLock },
      });
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    if (user.mfaEnabled) {
      if (!dto.mfaToken) {
        throw new UnauthorizedException('Se requiere código MFA. Volvé a enviar incluyendo "mfaToken".');
      }
      if (!user.mfaSecret || !verifyMfaToken(dto.mfaToken, user.mfaSecret)) {
        await this.audit.append({
          actorId: user.id,
          actorRole: user.role,
          action: 'AUTH_MFA_CHALLENGE',
          targetType: 'User',
          targetId: user.id,
          outcome: 'FAILURE',
          ip: ctx.ip,
          userAgent: ctx.userAgent,
          payload: {},
        });
        throw new UnauthorizedException('Código MFA inválido.');
      }
      await this.audit.append({
        actorId: user.id,
        actorRole: user.role,
        action: 'AUTH_MFA_CHALLENGE',
        targetType: 'User',
        targetId: user.id,
        outcome: 'SUCCESS',
        ip: ctx.ip,
        userAgent: ctx.userAgent,
        payload: {},
      });
    }

    await this.prisma.client.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), failedLoginCount: 0, lockedUntil: null },
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

  async refresh(refreshToken: string, ctx: RequestContext) {
    const tokenHash = hashToken(refreshToken);
    const stored = await this.prisma.client.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token inválido o expirado.');
    }
    let payload;
    try {
      payload = await verifyToken(refreshToken);
    } catch {
      throw new UnauthorizedException('Refresh token inválido.');
    }
    if (payload.sub !== stored.userId) {
      throw new UnauthorizedException('Refresh token no coincide con el usuario.');
    }
    if (stored.user.status === 'SUSPENDED' || stored.user.status === 'DELETED') {
      throw new UnauthorizedException('Cuenta inactiva.');
    }

    await this.prisma.client.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    return this.issueTokens(stored.user.id, stored.user.role, stored.user.mfaEnabled, ctx);
  }

  async verifyEmail(token: string) {
    const tokenHash = hashToken(token);
    const stored = await this.prisma.client.emailVerificationToken.findUnique({
      where: { tokenHash },
    });
    if (!stored || stored.consumedAt || stored.expiresAt < new Date()) {
      throw new BadRequestException('Token inválido o expirado.');
    }
    await this.prisma.client.$transaction([
      this.prisma.client.emailVerificationToken.update({
        where: { id: stored.id },
        data: { consumedAt: new Date() },
      }),
      this.prisma.client.user.update({
        where: { id: stored.userId },
        data: { emailVerifiedAt: new Date(), status: 'ACTIVE' },
      }),
    ]);
    return { ok: true };
  }

  async forgotPassword(email: string, ctx: RequestContext) {
    const user = await this.prisma.client.user.findUnique({ where: { email } });
    if (user && (user.status === 'ACTIVE' || user.status === 'PENDING_VERIFICATION')) {
      const resetToken = issueOneTimeToken();
      await this.prisma.client.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash: resetToken.hash,
          expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_HOURS * 3600 * 1000),
          ip: ctx.ip,
        },
      });
      await this.notifications.dispatch({
        userId: user.id,
        channel: 'EMAIL',
        category: 'PASSWORD_RESET',
        title: 'Recuperá tu contraseña de Pulso',
        body: `Recibimos un pedido para resetear tu contraseña. Si fuiste vos, hacé click en el enlace (válido ${PASSWORD_RESET_TTL_HOURS} hora). Si no fuiste vos, ignorá este mensaje.`,
        payload: {
          resetUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/reset?token=${resetToken.plain}`,
        },
      });
      await this.audit.append({
        actorId: user.id,
        actorRole: user.role,
        action: 'AUTH_PASSWORD_RESET',
        targetType: 'User',
        targetId: user.id,
        outcome: 'SUCCESS',
        ip: ctx.ip,
        userAgent: ctx.userAgent,
        payload: { stage: 'requested' },
      });
    }
    return { ok: true };
  }

  async resetPassword(token: string, newPassword: string, ctx: RequestContext) {
    const tokenHash = hashToken(token);
    const stored = await this.prisma.client.passwordResetToken.findUnique({
      where: { tokenHash },
    });
    if (!stored || stored.consumedAt || stored.expiresAt < new Date()) {
      throw new BadRequestException('Token inválido o expirado.');
    }
    const passwordHash = await hashPassword(newPassword);
    await this.prisma.client.$transaction([
      this.prisma.client.passwordResetToken.update({
        where: { id: stored.id },
        data: { consumedAt: new Date() },
      }),
      this.prisma.client.user.update({
        where: { id: stored.userId },
        data: { passwordHash, failedLoginCount: 0, lockedUntil: null },
      }),
      this.prisma.client.refreshToken.updateMany({
        where: { userId: stored.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
    await this.audit.append({
      actorId: stored.userId,
      actorRole: null,
      action: 'AUTH_PASSWORD_RESET',
      targetType: 'User',
      targetId: stored.userId,
      outcome: 'SUCCESS',
      ip: ctx.ip,
      userAgent: ctx.userAgent,
      payload: { stage: 'completed' },
    });
    return { ok: true };
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      const tokenHash = hashToken(refreshToken);
      await this.prisma.client.refreshToken.updateMany({
        where: { tokenHash, userId },
        data: { revokedAt: new Date() },
      });
    }
    await this.audit.append({
      actorId: userId,
      actorRole: null,
      action: 'AUTH_LOGOUT',
      targetType: 'User',
      targetId: userId,
      outcome: 'SUCCESS',
      payload: {},
    });
    return { ok: true };
  }

  async me(userId: string) {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        mfaEnabled: true,
        emailVerifiedAt: true,
        lastLoginAt: true,
        citizenProfile: {
          select: {
            id: true,
            dni: true,
            nombre: true,
            apellido: true,
            provincia: true,
            grupoSanguineo: true,
          },
        },
        professionalProfile: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            matriculaNacional: true,
            especialidades: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado.');
    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.client.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado.');

    const ok = user.passwordHash.startsWith('scrypt$')
      ? this.verifyScrypt(currentPassword, user.passwordHash)
      : await verifyPassword(currentPassword, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Contraseña actual incorrecta.');

    const passwordHash = await hashPassword(newPassword);
    await this.prisma.client.$transaction([
      this.prisma.client.user.update({ where: { id: userId }, data: { passwordHash } }),
      this.prisma.client.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
    await this.audit.append({
      actorId: userId,
      actorRole: user.role,
      action: 'AUTH_PASSWORD_RESET',
      targetType: 'User',
      targetId: userId,
      outcome: 'SUCCESS',
      payload: { stage: 'self_change' },
    });
    return { ok: true };
  }

  async mfaEnroll(userId: string) {
    const user = await this.prisma.client.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado.');
    if (user.mfaEnabled) {
      throw new BadRequestException('MFA ya está activado. Desactivalo primero si querés cambiarlo.');
    }
    const secret = generateMfaSecret();
    await this.prisma.client.user.update({
      where: { id: userId },
      data: { mfaSecret: secret, mfaEnabled: false },
    });
    return {
      secret,
      otpauthUrl: buildOtpAuthUrl(user.email, secret),
    };
  }

  async mfaActivate(userId: string, token: string) {
    const user = await this.prisma.client.user.findUnique({ where: { id: userId } });
    if (!user || !user.mfaSecret) {
      throw new BadRequestException('Primero hacé /auth/mfa/enroll.');
    }
    if (!verifyMfaToken(token, user.mfaSecret)) {
      throw new UnauthorizedException('Código MFA incorrecto.');
    }
    await this.prisma.client.user.update({
      where: { id: userId },
      data: { mfaEnabled: true },
    });
    return { ok: true };
  }

  async mfaDisable(userId: string, token: string) {
    const user = await this.prisma.client.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado.');
    if (!user.mfaEnabled || !user.mfaSecret) {
      throw new BadRequestException('MFA no está activo.');
    }
    if (!verifyMfaToken(token, user.mfaSecret)) {
      throw new UnauthorizedException('Código MFA incorrecto.');
    }
    if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
      throw new BadRequestException(
        'MFA es obligatorio para roles ADMIN+. Pedile a otro admin que cambie tu rol primero.',
      );
    }
    await this.prisma.client.user.update({
      where: { id: userId },
      data: { mfaEnabled: false, mfaSecret: null },
    });
    return { ok: true };
  }

  private async issueTokens(
    userId: string,
    role: Role,
    mfaSatisfied: boolean,
    ctx: RequestContext,
  ) {
    const access = await signAccessToken({ sub: userId, role, mfaSatisfied });
    const refresh = await signRefreshToken({ sub: userId, role });
    await this.prisma.client.refreshToken.create({
      data: {
        userId,
        tokenHash: hashToken(refresh),
        expiresAt: new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 3600 * 1000),
        ip: ctx.ip,
        userAgent: ctx.userAgent,
      },
    });
    return {
      ok: true,
      data: {
        accessToken: access,
        refreshToken: refresh,
        role,
        mfaRequired: !mfaSatisfied && (role === 'ADMIN' || role === 'SUPERADMIN'),
      },
    };
  }

  private verifyScrypt(password: string, stored: string): boolean {
    const parts = stored.split('$');
    if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
    const [, salt, expected] = parts as [string, string, string];

    const { scryptSync, timingSafeEqual } = require('node:crypto');
    const derived = scryptSync(password, salt, 64).toString('hex');
    if (derived.length !== expected.length) return false;
    return timingSafeEqual(Buffer.from(derived, 'hex'), Buffer.from(expected, 'hex'));
  }
}
