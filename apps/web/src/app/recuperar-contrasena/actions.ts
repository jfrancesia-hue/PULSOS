'use server';

import { apiFetch } from '@/lib/api';

export async function forgotAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  return apiFetch('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}
