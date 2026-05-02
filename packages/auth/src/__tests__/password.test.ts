import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, isStrongPassword } from '../password';

describe('password', () => {
  it('hashPassword genera hash bcrypt válido', async () => {
    const hash = await hashPassword('PulsoFuerte2026!');
    expect(hash.startsWith('$2')).toBe(true);
    expect(hash).not.toContain('PulsoFuerte2026!');
  });

  it('verifyPassword acepta el hash de la misma password', async () => {
    const hash = await hashPassword('PulsoFuerte2026!');
    expect(await verifyPassword('PulsoFuerte2026!', hash)).toBe(true);
    expect(await verifyPassword('Otra2026!Distinta', hash)).toBe(false);
  });

  it('hashPassword rechaza passwords cortas (<8 chars)', async () => {
    await expect(hashPassword('corta')).rejects.toThrow(/al menos 8/);
  });

  it('hashPassword acepta passphrase memorable de 8+ chars (NIST 2017)', async () => {
    const hash = await hashPassword('casa-azul-7');
    expect(hash.startsWith('$2')).toBe(true);
  });

  it('isStrongPassword exige mayúsculas, minúsculas y dígitos con 12+ (gating institucional)', () => {
    expect(isStrongPassword('Pulso2026Fuer!')).toBe(true);
    expect(isStrongPassword('todominusculas')).toBe(false);
    expect(isStrongPassword('TODOMAYUSCULAS123')).toBe(false);
    expect(isStrongPassword('Corta1A')).toBe(false);
  });
});
