'use server';

import { apiFetchAuthed } from '@/lib/api';

export async function markReadAction(id: string) {
  return apiFetchAuthed(`/notifications/${id}/read`, { method: 'POST' });
}

export async function markAllReadAction() {
  return apiFetchAuthed('/notifications/me/read-all', { method: 'POST' });
}
