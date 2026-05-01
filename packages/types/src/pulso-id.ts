import { z } from 'zod';
import {
  cuilSchema,
  dniSchema,
  generoAutopercibidoSchema,
  grupoSanguineoSchema,
  phoneArSchema,
  provinciaArSchema,
  sexoBiologicoSchema,
} from './common';

export const contactoEmergenciaSchema = z.object({
  nombre: z.string().min(2).max(120),
  telefono: phoneArSchema,
  relacion: z.enum(['PADRE', 'MADRE', 'HIJO', 'CONYUGE', 'HERMANO', 'AMIGO', 'OTRO']),
});
export type ContactoEmergencia = z.infer<typeof contactoEmergenciaSchema>;

export const coberturaMedicaSchema = z.object({
  tipo: z.enum(['OBRA_SOCIAL', 'PREPAGA', 'PUBLICA', 'NINGUNA']),
  obraSocial: z.string().max(200).optional(),
  numeroAfiliado: z.string().max(60).optional(),
  prepaga: z.string().max(200).optional(),
  plan: z.string().max(100).optional(),
});
export type CoberturaMedica = z.infer<typeof coberturaMedicaSchema>;

export const alergiaSchema = z.object({
  sustancia: z.string().min(2).max(200),
  severidad: z.enum(['LEVE', 'MODERADA', 'SEVERA', 'ANAFILACTICA']),
  notas: z.string().max(500).optional(),
});
export type Alergia = z.infer<typeof alergiaSchema>;

export const condicionCriticaSchema = z.object({
  codigo: z.string().min(2).max(20).optional(),
  nombre: z.string().min(2).max(200),
  desde: z.string().date().optional(),
  notas: z.string().max(500).optional(),
});
export type CondicionCritica = z.infer<typeof condicionCriticaSchema>;

export const medicacionHabitualSchema = z.object({
  nombre: z.string().min(2).max(200),
  presentacion: z.string().max(100).optional(),
  posologia: z.string().max(200).optional(),
  desde: z.string().date().optional(),
  motivo: z.string().max(200).optional(),
});
export type MedicacionHabitual = z.infer<typeof medicacionHabitualSchema>;

export const citizenProfileSchema = z.object({
  dni: dniSchema,
  cuil: cuilSchema.optional(),
  nombre: z.string().min(1).max(120),
  apellido: z.string().min(1).max(120),
  fechaNacimiento: z.string().date(),
  sexoBiologico: sexoBiologicoSchema,
  generoAutopercibido: generoAutopercibidoSchema.optional(),
  provincia: provinciaArSchema,
  localidad: z.string().max(120).optional(),
  telefono: phoneArSchema.optional(),
  contactoEmergencia: contactoEmergenciaSchema.optional(),
  cobertura: coberturaMedicaSchema.optional(),
  grupoSanguineo: grupoSanguineoSchema.default('DESCONOCIDO'),
  alergias: z.array(alergiaSchema).default([]),
  condicionesCriticas: z.array(condicionCriticaSchema).default([]),
  medicacionHabitual: z.array(medicacionHabitualSchema).default([]),
});
export type CitizenProfile = z.infer<typeof citizenProfileSchema>;
