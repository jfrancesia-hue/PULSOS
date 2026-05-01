import { z } from 'zod';

export const clinicalEventTypeSchema = z.enum([
  'CONSULTA',
  'EVOLUCION',
  'ESTUDIO',
  'INTERNACION',
  'CIRUGIA',
  'VACUNACION',
  'RECETA',
  'DERIVACION',
  'OTRO',
]);
export type ClinicalEventType = z.infer<typeof clinicalEventTypeSchema>;

export const clinicalRecordSchema = z.object({
  id: z.string().uuid(),
  ciudadanoId: z.string().uuid(),
  profesionalId: z.string().uuid().nullable(),
  institucionId: z.string().uuid().nullable(),
  tipo: clinicalEventTypeSchema,
  titulo: z.string().min(1).max(240),
  descripcion: z.string().max(8000).optional(),
  ocurridoEn: z.string().datetime(),
  documentos: z.array(z.string().uuid()).default([]),
});
export type ClinicalRecord = z.infer<typeof clinicalRecordSchema>;

export const clinicalDocumentTypeSchema = z.enum([
  'ESTUDIO_LAB',
  'ESTUDIO_IMAGEN',
  'RECETA',
  'INDICACION',
  'INFORME',
  'CERTIFICADO',
  'CONSENTIMIENTO',
  'OTRO',
]);
export type ClinicalDocumentType = z.infer<typeof clinicalDocumentTypeSchema>;

export const consentScopeSchema = z.enum([
  'PERFIL_BASICO',
  'PERFIL_COMPLETO',
  'TIMELINE_CLINICO',
  'CARGA_EVOLUCION',
  'EMERGENCIA',
]);
export type ConsentScope = z.infer<typeof consentScopeSchema>;

export const consentRequestSchema = z.object({
  ciudadanoId: z.string().uuid(),
  profesionalId: z.string().uuid().optional(),
  institucionId: z.string().uuid().optional(),
  scopes: z.array(consentScopeSchema).min(1),
  duracionHoras: z.number().int().min(1).max(24 * 365).default(24),
  motivo: z.string().min(2).max(500),
});
export type ConsentRequest = z.infer<typeof consentRequestSchema>;
