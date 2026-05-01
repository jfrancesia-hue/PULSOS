'use server';

import { redirect } from 'next/navigation';
import { apiAuthed } from '@/lib/api';
import { clearAdminCookies } from '@/lib/session';

export async function logoutAction() {
  await apiAuthed('/auth/logout', { method: 'POST' });
  await clearAdminCookies();
  redirect('/ingresar');
}
