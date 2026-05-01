'use server';

import { apiFetch } from '@/lib/api';
import { setSessionCookies } from '@/lib/session';

export async function signupAction(
  formData: FormData,
): Promise<{ ok: true; redirect: string } | { ok: false; error: string }> {
  const payload = {
    email: String(formData.get('email') ?? '').trim(),
    password: String(formData.get('password') ?? ''),
    nombre: String(formData.get('nombre') ?? '').trim(),
    apellido: String(formData.get('apellido') ?? '').trim(),
    dni: String(formData.get('dni') ?? '').trim(),
    fechaNacimiento: String(formData.get('fechaNacimiento') ?? ''),
    sexoBiologico: String(formData.get('sexoBiologico') ?? ''),
    provincia: String(formData.get('provincia') ?? ''),
    localidad: String(formData.get('localidad') ?? '') || undefined,
    telefono: String(formData.get('telefono') ?? '') || undefined,
  };

  const res = await apiFetch<{ ok: true; data: { accessToken: string; refreshToken: string } }>(
    '/auth/signup',
    { method: 'POST', body: JSON.stringify(payload) },
  );
  if (!res.ok) return { ok: false, error: res.error.message };

  await setSessionCookies(res.data.data.accessToken, res.data.data.refreshToken);
  return { ok: true, redirect: '/panel' };
}
