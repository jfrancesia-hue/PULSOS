import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import type { Role } from '@pulso/types';
import { InvalidTokenError } from './errors';

const ISSUER = 'pulso.nativos.consulting';
const AUDIENCE = 'pulso-clients';

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET no configurado o demasiado corto (>=32 chars).');
  }
  return new TextEncoder().encode(secret);
}

export interface PulsoJwtPayload extends JWTPayload {
  sub: string;
  role: Role;
  institutionId?: string;
  mfaSatisfied?: boolean;
}

export async function signAccessToken(
  payload: Omit<PulsoJwtPayload, 'iss' | 'aud' | 'exp' | 'iat'>,
  expiresIn: string = process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret());
}

export async function signRefreshToken(
  payload: Omit<PulsoJwtPayload, 'iss' | 'aud' | 'exp' | 'iat'>,
  expiresIn: string = process.env.JWT_REFRESH_EXPIRES_IN ?? '14d',
): Promise<string> {
  return new SignJWT({ ...payload, scope: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<PulsoJwtPayload> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    return payload as PulsoJwtPayload;
  } catch (err) {
    throw new InvalidTokenError(err instanceof Error ? err.message : 'Token inválido');
  }
}
