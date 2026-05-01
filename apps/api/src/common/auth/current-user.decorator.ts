import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Role } from '@pulso/types';
import type { Request } from 'express';

export interface AuthContext {
  userId: string;
  role: Role;
  institutionId?: string;
  mfaSatisfied: boolean;
}

export const CurrentUser = createParamDecorator((_, ctx: ExecutionContext): AuthContext => {
  const req = ctx.switchToHttp().getRequest<Request & { user?: AuthContext }>();
  if (!req.user) {
    throw new Error('CurrentUser usado fuera de contexto autenticado.');
  }
  return req.user;
});
