'use server';

import { redirect } from 'next/navigation';
import { apiFetchAuthed } from '@/lib/api';
import { clearSessionCookies } from '@/lib/session';

export async function logoutAction() {
  await apiFetchAuthed<{ ok: true }>('/auth/logout', { method: 'POST' });
  await clearSessionCookies();
  redirect('/');
}
