import { describe, it, expect } from 'vitest';
import {
  buildAuditRow,
  computeRowHash,
  GENESIS_HASH,
  hashPayload,
  verifyChain,
} from '../hash-chain';
import type { AuditEntryInput } from '../types';

const baseInput = (overrides: Partial<AuditEntryInput> = {}): AuditEntryInput => ({
  actorId: 'user-1',
  actorRole: 'CIUDADANO',
  action: 'AUTH_LOGIN_SUCCESS',
  targetType: 'User',
  targetId: 'user-1',
  outcome: 'SUCCESS',
  payload: { ip: '127.0.0.1' },
  ...overrides,
});

describe('hash-chain', () => {
  it('hashPayload es determinístico independiente del orden de keys', () => {
    const a = hashPayload({ b: 1, a: 2, c: { y: 1, x: 2 } });
    const b = hashPayload({ a: 2, c: { x: 2, y: 1 }, b: 1 });
    expect(a).toBe(b);
  });

  it('computeRowHash incluye previousHash en el cómputo', () => {
    const args = {
      previousHash: GENESIS_HASH,
      payloadHash: hashPayload({ k: 1 }),
      actorId: 'u',
      action: 'AUTH_LOGIN_SUCCESS',
      targetType: 'User',
      targetId: 'u',
      outcome: 'SUCCESS',
      occurredAt: '2026-05-01T00:00:00.000Z',
    };
    const h1 = computeRowHash(args);
    const h2 = computeRowHash({ ...args, previousHash: 'a'.repeat(64) });
    expect(h1).not.toBe(h2);
    expect(h1).toMatch(/^[0-9a-f]{64}$/);
  });

  it('buildAuditRow encadena correctamente', () => {
    const row1 = buildAuditRow(baseInput(), GENESIS_HASH, '2026-05-01T00:00:00.000Z');
    const row2 = buildAuditRow(baseInput({ action: 'AUTH_LOGOUT' }), row1.currentHash, '2026-05-01T00:01:00.000Z');
    expect(row2.previousHash).toBe(row1.currentHash);
    expect(row2.currentHash).not.toBe(row1.currentHash);
  });

  it('verifyChain detecta cadena íntegra', () => {
    const row1 = buildAuditRow(baseInput(), GENESIS_HASH, '2026-05-01T00:00:00.000Z');
    const row2 = buildAuditRow(baseInput({ action: 'AUTH_LOGOUT' }), row1.currentHash, '2026-05-01T00:01:00.000Z');
    const result = verifyChain(
      [
        { ...row1, sequenceNum: 1n },
        { ...row2, sequenceNum: 2n },
      ],
      GENESIS_HASH,
    );
    expect(result.ok).toBe(true);
    expect(result.totalChecked).toBe(2);
  });

  it('verifyChain detecta tampering en currentHash', () => {
    const row1 = buildAuditRow(baseInput(), GENESIS_HASH, '2026-05-01T00:00:00.000Z');
    const row2 = buildAuditRow(baseInput(), row1.currentHash, '2026-05-01T00:01:00.000Z');
    const tampered = { ...row2, currentHash: '0'.repeat(64), sequenceNum: 2n };
    const result = verifyChain(
      [
        { ...row1, sequenceNum: 1n },
        tampered,
      ],
      GENESIS_HASH,
    );
    expect(result.ok).toBe(false);
    expect(result.brokenAt?.sequenceNum).toBe(2n);
  });

  it('verifyChain detecta inserción/eliminación rompiendo previousHash', () => {
    const row1 = buildAuditRow(baseInput(), GENESIS_HASH, '2026-05-01T00:00:00.000Z');
    const row2 = buildAuditRow(baseInput(), row1.currentHash, '2026-05-01T00:01:00.000Z');
    // simulamos que alguien borró row1: la fila restante tiene previousHash que no coincide
    const result = verifyChain([{ ...row2, sequenceNum: 2n }], GENESIS_HASH);
    expect(result.ok).toBe(false);
  });
});
