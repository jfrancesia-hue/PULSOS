'use server';

import { apiFetchAuthed } from '@/lib/api';

export async function createQrAction(ttl: 'H_24' | 'D_7' | 'D_30' | 'NUNCA') {
  return apiFetchAuthed('/emergency/me', {
    method: 'POST',
    body: JSON.stringify({ ttl }),
  });
}

export async function revokeQrAction(qrId: string) {
  return apiFetchAuthed(`/emergency/me/${qrId}`, { method: 'DELETE' });
}
