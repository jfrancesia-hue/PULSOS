import { z } from 'zod';

export const roleSchema = z.enum([
  'CIUDADANO',
  'PROFESIONAL',
  'FARMACIA',
  'INSTITUCION',
  'ADMIN',
  'SUPERADMIN',
]);
export type Role = z.infer<typeof roleSchema>;

export const ROLE_HIERARCHY: Record<Role, number> = {
  CIUDADANO: 0,
  PROFESIONAL: 10,
  FARMACIA: 10,
  INSTITUCION: 20,
  ADMIN: 30,
  SUPERADMIN: 40,
};

export function hasMinimumRole(actual: Role, required: Role): boolean {
  return ROLE_HIERARCHY[actual] >= ROLE_HIERARCHY[required];
}

export const MFA_REQUIRED_ROLES: Role[] = ['ADMIN', 'SUPERADMIN'];

export type RoleScope = {
  role: Role;
  institutionId?: string;
};
