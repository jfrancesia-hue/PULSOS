'use server';

import { apiFetchAuthed } from '@/lib/api';

export async function saveEvolucionAction(input: {
  ciudadanoId: string;
  tipo: string;
  titulo: string;
  descripcion?: string;
}) {
  return apiFetchAuthed('/clinical/evolucion', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
