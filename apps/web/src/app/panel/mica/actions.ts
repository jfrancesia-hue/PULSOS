'use server';

import { apiFetchAuthed } from '@/lib/api';

interface MicaMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface MicaResponse {
  texto: string;
  triage: 'INFORMATIVO' | 'CONSULTA_NO_URGENTE' | 'CONSULTA_PRIORITARIA' | 'GUARDIA_INMEDIATA';
  derivacionSugerida: string | null;
  prescriptionFlagged: boolean;
  mode: 'live' | 'mock';
}

export async function sendMicaMessage(conversation: MicaMessage[]) {
  return apiFetchAuthed<MicaResponse>('/mica/chat', {
    method: 'POST',
    body: JSON.stringify({ conversation }),
  });
}
