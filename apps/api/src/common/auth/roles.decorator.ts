import { SetMetadata } from '@nestjs/common';
import type { Role } from '@pulso/types';

export const ROLES_KEY = 'pulso:roles';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
