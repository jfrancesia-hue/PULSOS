'use server';

import { apiFetch } from '@/lib/api';
import { setAdminCookies } from '@/lib/session';

export async function adminLoginAction(
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) return { ok: false, error: 'Completá email y contraseña.' };

  const res = await apiFetch<{ ok: true; data: { accessToken: string; refreshToken: string; role: string } }>(
    '/auth/login',
    { method: 'POST', body: JSON.stringify({ email, password }) },
  );
  if (!res.ok) return { ok: false, error: res.error.message };

  const role = res.data.data.role;
  if (!['ADMIN', 'SUPERADMIN'].includes(role)) {
    return { ok: false, error: 'Esta cuenta no tiene permisos de admin. Usá el panel ciudadano.' };
  }

  await setAdminCookies(res.data.data.accessToken, res.data.data.refreshToken);
  return { ok: true };
}
