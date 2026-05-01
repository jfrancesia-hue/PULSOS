'use server';

import { apiFetchAuthed } from '@/lib/api';

export async function searchAction(dni: string) {
  return apiFetchAuthed(`/clinical/search?dni=${encodeURIComponent(dni)}`);
}

export async function requestConsentAction(input: { dni: string; scopes: string[]; motivo: string }) {
  return apiFetchAuthed('/clinical/consent/request', {
    method: 'POST',
    body: JSON.stringify({
      ciudadanoDni: input.dni,
      scopes: input.scopes,
      motivo: input.motivo,
    }),
  });
}
