'use server';

import { apiFetchAuthed } from '@/lib/api';

interface SavePayload {
  basic: { nombre: string; apellido: string; localidad: string; telefono: string };
  alergias: Array<{ sustancia: string; severidad: string; notas?: string }>;
  medicacion: Array<{ nombre: string; presentacion?: string; posologia?: string; motivo?: string }>;
  condiciones: Array<{ codigo?: string; nombre: string; notas?: string }>;
  contacto: { nombre: string; telefono: string; relacion: string } | null;
}

export async function saveProfileAction(payload: SavePayload): Promise<{ ok: boolean; msg: string }> {
  const calls = [
    apiFetchAuthed('/pulso-id/me', {
      method: 'PATCH',
      body: JSON.stringify({
        nombre: payload.basic.nombre,
        apellido: payload.basic.apellido,
        localidad: payload.basic.localidad || undefined,
        telefono: payload.basic.telefono || undefined,
      }),
    }),
    apiFetchAuthed('/pulso-id/me/alergias', {
      method: 'PATCH',
      body: JSON.stringify({ alergias: payload.alergias.filter((a) => a.sustancia.trim()) }),
    }),
    apiFetchAuthed('/pulso-id/me/medicacion', {
      method: 'PATCH',
      body: JSON.stringify({ medicacion: payload.medicacion.filter((m) => m.nombre.trim()) }),
    }),
    apiFetchAuthed('/pulso-id/me/condiciones', {
      method: 'PATCH',
      body: JSON.stringify({ condiciones: payload.condiciones.filter((c) => c.nombre.trim()) }),
    }),
  ];

  if (payload.contacto && payload.contacto.nombre && payload.contacto.telefono) {
    calls.push(
      apiFetchAuthed('/pulso-id/me/contacto-emergencia', {
        method: 'PATCH',
        body: JSON.stringify(payload.contacto),
      }),
    );
  }

  const results = await Promise.all(calls);
  const failed = results.find((r) => !r.ok);
  if (failed) {
    return { ok: false, msg: failed.error.message };
  }
  return { ok: true, msg: 'Datos guardados.' };
}
