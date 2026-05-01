import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiFetch } from './api';

const ACCESS_COOKIE = 'pulso_access';
const REFRESH_COOKIE = 'pulso_refresh';

export interface SessionUser {
  id: string;
  email: string;
  role: 'CIUDADANO' | 'PROFESIONAL' | 'FARMACIA' | 'INSTITUCION' | 'ADMIN' | 'SUPERADMIN';
  status: string;
  mfaEnabled: boolean;
  citizenProfile: {
    id: string;
    dni: string;
    nombre: string;
    apellido: string;
    provincia: string;
    grupoSanguineo: string;
  } | null;
  professionalProfile: {
    id: string;
    nombre: string;
    apellido: string;
    matriculaNacional: string | null;
    especialidades: string[];
  } | null;
}

export async function setSessionCookies(accessToken: string, refreshToken: string) {
  const store = await cookies();
  store.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24, // 1d, refresh token alarga la sesión
  });
  store.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearSessionCookies() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const accessToken = store.get(ACCESS_COOKIE)?.value;
  if (!accessToken) return null;
  const result = await apiFetch<SessionUser>('/auth/me', { authToken: accessToken });
  if (!result.ok) return null;
  return result.data;
}

export async function requireUser(redirectTo = '/ingresar'): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(redirectTo);
  return user;
}

export async function requireRole(
  roles: SessionUser['role'][],
  redirectTo = '/ingresar',
): Promise<SessionUser> {
  const user = await requireUser(redirectTo);
  if (!roles.includes(user.role)) {
    redirect('/');
  }
  return user;
}
