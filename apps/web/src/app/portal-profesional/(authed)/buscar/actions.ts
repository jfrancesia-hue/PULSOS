'use server';

import { apiFetchAuthed } from '@/lib/api';

export interface SearchHit {
  found: boolean;
  consent_required?: boolean;
  reason?: 'NOT_FOUND';
  ciudadano?: {
    id: string;
    dni?: string;
    nombre: string;
    apellido?: string;
    inicial?: string;
    grupoSanguineo?: string;
    alergias?: Array<{ sustancia: string; severidad: string }>;
    condicionesCriticas?: Array<{ nombre: string }>;
    medicacionHabitual?: Array<{ nombre: string }>;
  };
  consent?: {
    id: string;
    scopes: string[];
    expiresAt: string | null;
  };
}

export async function searchAction(dni: string) {
  return apiFetchAuthed<SearchHit>(`/clinical/search?dni=${encodeURIComponent(dni)}`);
}

export async function requestConsentAction(input: { dni: string; scopes: string[]; motivo: string }) {
  return apiFetchAuthed<{ ok: true }>('/clinical/consent/request', {
    method: 'POST',
    body: JSON.stringify({
      ciudadanoDni: input.dni,
      scopes: input.scopes,
      motivo: input.motivo,
    }),
  });
}
