'use server';

import { apiFetch } from '@/lib/api';
import { setSessionCookies } from '@/lib/session';

interface LoginResponse {
  ok: true;
  data: {
    accessToken: string;
    refreshToken: string;
    role: string;
    mfaRequired: boolean;
  };
}

export async function loginAction(
  formData: FormData,
): Promise<{ ok: true; redirect: string } | { ok: false; error: string }> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { ok: false, error: 'Completá email y contraseña.' };
  }

  const res = await apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    return { ok: false, error: res.error.message };
  }

  const data = res.data.data;
  await setSessionCookies(data.accessToken, data.refreshToken);

  const redirect =
    data.role === 'PROFESIONAL'
      ? '/portal-profesional/dashboard'
      : data.role === 'ADMIN' || data.role === 'SUPERADMIN'
        ? '/panel'
        : '/panel';

  return { ok: true, redirect };
}
