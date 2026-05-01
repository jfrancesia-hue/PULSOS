import { z } from 'zod';

export const idSchema = z.string().uuid();
export type Id = z.infer<typeof idSchema>;

export const cuilSchema = z
  .string()
  .regex(/^\d{2}-\d{8}-\d$/, 'CUIL inválido. Formato esperado: XX-XXXXXXXX-X');

export const dniSchema = z
  .string()
  .regex(/^\d{7,9}$/, 'DNI inválido. Solo números, sin puntos ni guiones.');

export const phoneArSchema = z
  .string()
  .regex(/^\+?54\s?9?\s?\d{2,4}\s?\d{6,8}$/, 'Teléfono argentino inválido.');

export const provinciaArSchema = z.enum([
  'CABA',
  'BUENOS_AIRES',
  'CATAMARCA',
  'CHACO',
  'CHUBUT',
  'CORDOBA',
  'CORRIENTES',
  'ENTRE_RIOS',
  'FORMOSA',
  'JUJUY',
  'LA_PAMPA',
  'LA_RIOJA',
  'MENDOZA',
  'MISIONES',
  'NEUQUEN',
  'RIO_NEGRO',
  'SALTA',
  'SAN_JUAN',
  'SAN_LUIS',
  'SANTA_CRUZ',
  'SANTA_FE',
  'SANTIAGO_DEL_ESTERO',
  'TIERRA_DEL_FUEGO',
  'TUCUMAN',
]);
export type ProvinciaAr = z.infer<typeof provinciaArSchema>;

export const sexoBiologicoSchema = z.enum(['MASCULINO', 'FEMENINO', 'INTERSEXUAL']);
export type SexoBiologico = z.infer<typeof sexoBiologicoSchema>;

export const generoAutopercibidoSchema = z.enum([
  'MASCULINO',
  'FEMENINO',
  'NO_BINARIO',
  'OTRO',
  'PREFIERE_NO_DECIR',
]);
export type GeneroAutopercibido = z.infer<typeof generoAutopercibidoSchema>;

export const grupoSanguineoSchema = z.enum([
  'A_POSITIVO',
  'A_NEGATIVO',
  'B_POSITIVO',
  'B_NEGATIVO',
  'AB_POSITIVO',
  'AB_NEGATIVO',
  'O_POSITIVO',
  'O_NEGATIVO',
  'DESCONOCIDO',
]);
export type GrupoSanguineo = z.infer<typeof grupoSanguineoSchema>;

export type ApiSuccess<T> = { ok: true; data: T };
export type ApiError = {
  ok: false;
  error: { code: string; message: string; details?: Record<string, unknown> };
};
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export type Pagination = z.infer<typeof paginationSchema>;

export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};
