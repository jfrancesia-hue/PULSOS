import bcrypt from 'bcryptjs';

const COST = 12;

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
