import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { hasMinimumRole, MFA_REQUIRED_ROLES, type Role } from '@pulso/types';
import type { Request } from 'express';
import { ROLES_KEY } from './roles.decorator';
import type { AuthContext } from './current-user.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[] | undefined>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const req = context.switchToHttp().getRequest<Request & { user?: AuthContext }>();
    const user = req.user;
    if (!user) throw new UnauthorizedException('No autenticado.');

    const allowed = required.some((r) => hasMinimumRole(user.role, r));
    if (!allowed) {
      throw new ForbiddenException(
        `Rol insuficiente: requiere ${required.join(' o ')}, presente ${user.role}`,
      );
    }
    if (MFA_REQUIRED_ROLES.includes(user.role) && !user.mfaSatisfied) {
      throw new UnauthorizedException('Se requiere segundo factor (MFA).');
    }
    return true;
  }
}
