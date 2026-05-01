'use server';

import { apiAuthed } from '@/lib/api';

export async function changeRoleAction(userId: string, role: string) {
  return apiAuthed(`/admin/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}

export async function changeStatusAction(userId: string, status: string) {
  return apiAuthed(`/admin/users/${userId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
