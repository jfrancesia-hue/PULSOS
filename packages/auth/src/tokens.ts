import { createHash, randomBytes } from 'node:crypto';

/**
 * Tokens de un solo uso para verificación de email y reset de password.
 * Se almacena solo el hash en DB. El token plano viaja por email al usuario.
 */

export interface OneTimeToken {
  /** Token plano (se manda por email/SMS al usuario, NUNCA se guarda). */
  plain: string;
  /** Hash determinístico para almacenar en DB. */
  hash: string;
}

const TOKEN_BYTES = 32;

export function issueOneTimeToken(): OneTimeToken {
  const plain = randomBytes(TOKEN_BYTES).toString('base64url');
  const hash = sha256(plain);
  return { plain, hash };
}

export function hashToken(plain: string): string {
  return sha256(plain);
}

function sha256(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}
