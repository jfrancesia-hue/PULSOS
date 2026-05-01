import { z } from 'zod';

export const micaMessageRoleSchema = z.enum(['user', 'assistant', 'system']);
export type MicaMessageRole = z.infer<typeof micaMessageRoleSchema>;

export const micaMessageSchema = z.object({
  role: micaMessageRoleSchema,
  content: z.string().min(1).max(8000),
  at: z.string().datetime().optional(),
});
export type MicaMessage = z.infer<typeof micaMessageSchema>;

export const micaTriageSchema = z.enum([
  'INFORMATIVO',
  'CONSULTA_NO_URGENTE',
  'CONSULTA_PRIORITARIA',
  'GUARDIA_INMEDIATA',
]);
export type MicaTriage = z.infer<typeof micaTriageSchema>;

export const micaResponseSchema = z.object({
  texto: z.string(),
  triage: micaTriageSchema,
  derivacionSugerida: z.string().nullable(),
  recordatoriosCreados: z.array(z.string()).default([]),
  prescriptionFlagged: z.boolean(),
});
export type MicaResponse = z.infer<typeof micaResponseSchema>;
