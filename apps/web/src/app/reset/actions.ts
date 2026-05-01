'use server';

import { apiFetch } from '@/lib/api';

export async function resetAction(token: string, newPassword: string) {
  return apiFetch('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
}
