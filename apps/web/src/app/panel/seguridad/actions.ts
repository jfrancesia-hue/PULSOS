'use server';

import { apiFetchAuthed } from '@/lib/api';

export async function changePasswordAction(currentPassword: string, newPassword: string) {
  return apiFetchAuthed('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function mfaEnrollAction() {
  return apiFetchAuthed<{ secret: string; otpauthUrl: string }>('/auth/mfa/enroll', {
    method: 'POST',
  });
}

export async function mfaActivateAction(token: string) {
  return apiFetchAuthed('/auth/mfa/activate', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export async function mfaDisableAction(token: string) {
  return apiFetchAuthed('/auth/mfa/disable', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}
