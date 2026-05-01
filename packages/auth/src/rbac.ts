import { hasMinimumRole, MFA_REQUIRED_ROLES, type Role } from '@pulso/types';
import { ForbiddenError, MfaRequiredError } from './errors';

export interface AuthContext {
  userId: string;
  role: Role;
  institutionId?: string;
  mfaSatisfied?: boolean;
}

export function assertRole(ctx: AuthContext, required: Role): void {
  if (!hasMinimumRole(ctx.role, required)) {
    throw new ForbiddenError(`Rol insuficiente: requiere ${required}, presente ${ctx.role}`);
  }
  if (MFA_REQUIRED_ROLES.includes(ctx.role) && !ctx.mfaSatisfied) {
    throw new MfaRequiredError();
  }
}

export function assertOwnerOrRole(
  ctx: AuthContext,
  resourceOwnerId: string,
  fallbackRole: Role,
): void {
  if (ctx.userId === resourceOwnerId) {
    return;
  }
  assertRole(ctx, fallbackRole);
}

export function isOwner(ctx: AuthContext, resourceOwnerId: string): boolean {
  return ctx.userId === resourceOwnerId;
}
