import { z } from 'zod';

export const emergencyTtlSchema = z.enum(['H_24', 'D_7', 'D_30', 'NUNCA']);
export type EmergencyTtl = z.infer<typeof emergencyTtlSchema>;

export const TTL_TO_SECONDS: Record<EmergencyTtl, number | null> = {
  H_24: 60 * 60 * 24,
  D_7: 60 * 60 * 24 * 7,
  D_30: 60 * 60 * 24 * 30,
  NUNCA: null,
};

export const emergencyAccessLogSchema = z.object({
  id: z.string().uuid(),
  accessedAt: z.string().datetime(),
  ip: z.string().nullable(),
  userAgent: z.string().nullable(),
  geoApprox: z.string().nullable(),
});
export type EmergencyAccessLog = z.infer<typeof emergencyAccessLogSchema>;

export const emergencyPublicViewSchema = z.object({
  nombre: z.string(),
  apellido: z.string(),
  edad: z.number().int().min(0).max(130),
  grupoSanguineo: z.string(),
  alergias: z.array(z.string()),
  condicionesCriticas: z.array(z.string()),
  medicacionHabitual: z.array(z.string()),
  contactoEmergencia: z
    .object({
      nombre: z.string(),
      telefono: z.string(),
      relacion: z.string(),
    })
    .nullable(),
  cobertura: z
    .object({
      tipo: z.string(),
      obraSocial: z.string().nullable(),
      numeroAfiliado: z.string().nullable(),
    })
    .nullable(),
  emitidoEn: z.string().datetime(),
});
export type EmergencyPublicView = z.infer<typeof emergencyPublicViewSchema>;
