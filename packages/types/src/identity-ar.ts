/**
 * Validadores de identidad argentina.
 *  - DNI: solo formato (RENAPER es la única fuente de verdad real, integración futura).
 *  - CUIL/CUIT: dígito verificador algorítmico (módulo 11).
 */

const CUIL_PESOS = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

export function isValidDniFormat(dni: string): boolean {
  return /^\d{7,9}$/.test(dni);
}

/**
 * Valida CUIL/CUIT en formato XX-XXXXXXXX-X o XXXXXXXXXXX (11 dígitos).
 * Verifica el dígito verificador con módulo 11.
 */
export function isValidCuil(cuil: string): boolean {
  const clean = cuil.replace(/[-\s]/g, '');
  if (!/^\d{11}$/.test(clean)) return false;

  const digits = clean.split('').map(Number);
  const dvProvided = digits[10]!;

  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += digits[i]! * CUIL_PESOS[i]!;
  }

  const mod = sum % 11;
  let dv: number;
  if (mod === 0) dv = 0;
  else if (mod === 1) {
    // Caso especial Argentina: el primer dígito (sexo) cambia.
    // Para validación simple, se considera inválido si no fue ya manejado en alta.
    return false;
  } else {
    dv = 11 - mod;
  }

  return dv === dvProvided;
}

/**
 * Genera un CUIL "DNI-derivado" para tests/seed con prefijo 20 (M) o 27 (F).
 * Útil para crear datos demo con CUIL válido sin RENAPER.
 */
export function buildCuilFromDni(dni: string, prefix: '20' | '23' | '24' | '25' | '26' | '27' | '30' = '20'): string {
  const padded = dni.padStart(8, '0');
  const base = `${prefix}${padded}`;
  const digits = base.split('').map(Number);
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += digits[i]! * CUIL_PESOS[i]!;
  }
  const mod = sum % 11;
  const dv = mod === 0 ? 0 : mod === 1 ? 9 : 11 - mod;
  return `${prefix}-${padded}-${dv}`;
}

export function formatCuil(cuil: string): string {
  const clean = cuil.replace(/[-\s]/g, '');
  if (clean.length !== 11) return cuil;
  return `${clean.slice(0, 2)}-${clean.slice(2, 10)}-${clean.slice(10)}`;
}
