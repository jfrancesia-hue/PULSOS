'use server';

import { apiFetchAuthed } from '@/lib/api';

export async function createReminderAction(payload: {
  medicacion: string;
  presentacion?: string;
  posologia?: string;
  frequency: string;
  hours: string[];
  startDate: string;
  endDate?: string;
}) {
  return apiFetchAuthed('/reminders/me', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateReminderAction(id: string, dto: { active?: boolean; hours?: string[]; endDate?: string }) {
  return apiFetchAuthed(`/reminders/me/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  });
}

export async function deleteReminderAction(id: string) {
  return apiFetchAuthed(`/reminders/me/${id}`, { method: 'DELETE' });
}
