'use server';

import { apiFetchAuthed } from '@/lib/api';

export async function approveConsentAction(id: string, durationDays = 30) {
  return apiFetchAuthed(`/clinical/consent/${id}/respond`, {
    method: 'POST',
    body: JSON.stringify({ decision: 'APPROVE', durationDays }),
  });
}

export async function rejectConsentAction(id: string, rejectionReason?: string) {
  return apiFetchAuthed(`/clinical/consent/${id}/respond`, {
    method: 'POST',
    body: JSON.stringify({ decision: 'REJECT', rejectionReason }),
  });
}

export async function revokeConsentAction(id: string) {
  return apiFetchAuthed(`/clinical/consent/${id}/revoke`, { method: 'POST' });
}
