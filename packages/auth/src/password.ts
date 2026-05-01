import bcrypt from 'bcryptjs';
import { scryptSync, timingSafeEqual } from 'node:crypto';

const COST = 12;
const SCRYPT_PREFIX = 'scrypt$';

export async function hashPassword(plain: string): Promise<string> {
  if (plain.length < 12) {
    throw new Error('La contraseña debe tener al menos 12 caracteres.');
  }
  return bcrypt.hash(plain, COST);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function isStrongPassword(plain: string): boolean {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/.test(plain);
}

/**
 * Verifica una contraseña contra hash bcrypt o el formato scrypt$salt$hash
 * usado por el seed (legacy). Soporta migración transparente: cuando un usuario
 * con scrypt cambia su password, el siguiente hash queda en bcrypt.
 */
export async function verifyPasswordHybrid(plain: string, stored: string): Promise<boolean> {
  if (stored.startsWith(SCRYPT_PREFIX)) {
    return verifyScrypt(plain, stored);
  }
  return verifyPassword(plain, stored);
}

function verifyScrypt(plain: string, stored: string): boolean {
  const parts = stored.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const [, salt, expected] = parts as [string, string, string];
  const derived = scryptSync(plain, salt, 64).toString('hex');
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(derived, 'hex'), Buffer.from(expected, 'hex'));
}
