import { authenticator } from 'otplib';

authenticator.options = { window: 1, step: 30, digits: 6 };

export function generateMfaSecret(): string {
  return authenticator.generateSecret();
}

export function buildOtpAuthUrl(label: string, secret: string): string {
  return authenticator.keyuri(label, 'Pulso', secret);
}

export function verifyMfaToken(token: string, secret: string): boolean {
  try {
    return authenticator.verify({ token, secret });
  } catch {
    return false;
  }
}
