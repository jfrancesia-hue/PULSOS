import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiFetch } from './api';

const ACCESS = 'pulso_admin_access';
const REFRESH = 'pulso_admin_refresh';

export interface AdminUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'SUPERADMIN' | 'CIUDADANO' | 'PROFESIONAL' | 'FARMACIA' | 'INSTITUCION';
  status: string;
  mfaEnabled: boolean;
}

export async function setAdminCookies(access: string, refresh: string) {
  const store = await cookies();
  store.set(ACCESS, access, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  store.set(REFRESH, refresh, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearAdminCookies() {
  const store = await cookies();
  store.delete(ACCESS);
  store.delete(REFRESH);
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const store = await cookies();
  const access = store.get(ACCESS)?.value;
  if (!access) return null;
  const r = await apiFetch<AdminUser>('/auth/me', { authToken: access });
  if (!r.ok) return null;
  return r.data;
}

export async function requireAdmin(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) redirect('/ingresar');
  if (!['ADMIN', 'SUPERADMIN'].includes(user.role)) redirect('/ingresar');
  return user;
}
