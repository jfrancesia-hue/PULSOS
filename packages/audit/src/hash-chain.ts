import { createHash } from 'node:crypto';
import type { AuditEntryInput, AuditEntryStored, ChainVerificationResult } from './types';

export const GENESIS_HASH = '0'.repeat(64);

export function sha256(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

/**
 * Hash determinístico del payload sensible.
 * Usa salt de entorno para que el mismo payload no genere el mismo hash entre tenants/instalaciones.
 */
export function hashPayload(payload: Record<string, unknown>): string {
  const salt = process.env.AUDIT_HASH_SALT ?? '';
  const canonical = canonicalize({ payload, salt });
  return sha256(canonical);
}

/**
 * Hash de la fila completa: encadena con la fila anterior.
 * canonical = previousHash | payloadHash | actorId | action | targetType | targetId | outcome | occurredAt
 */
export function computeRowHash(opts: {
  previousHash: string;
  payloadHash: string;
  actorId: string | null;
  action: string;
  targetType: string | null;
  targetId: string | null;
  outcome: string;
  occurredAt: string;
}): string {
  const canonical = [
    opts.previousHash,
    opts.payloadHash,
    opts.actorId ?? '',
    opts.action,
    opts.targetType ?? '',
    opts.targetId ?? '',
    opts.outcome,
    opts.occurredAt,
  ].join('|');
  return sha256(canonical);
}

/**
 * Build a fila lista para insertar a partir del input + hash de la fila anterior.
 * Retorna los campos hash; los campos id, sequenceNum, occurredAt los completa la DB.
 */
export function buildAuditRow(
  input: AuditEntryInput,
  previousHash: string,
  occurredAt: string = new Date().toISOString(),
) {
  const payloadHash = hashPayload(input.payload);
  const currentHash = computeRowHash({
    previousHash,
    payloadHash,
    actorId: input.actorId,
    action: input.action,
    targetType: input.targetType,
    targetId: input.targetId,
    outcome: input.outcome,
    occurredAt,
  });
  return {
    actorId: input.actorId,
    actorRole: input.actorRole,
    action: input.action,
    targetType: input.targetType,
    targetId: input.targetId,
    outcome: input.outcome,
    ip: input.ip ?? null,
    userAgent: input.userAgent ?? null,
    payloadHash,
    previousHash,
    currentHash,
    occurredAt,
  };
}

/**
 * Verifica integridad secuencial de un rango de filas.
 * Retorna { ok: false, brokenAt } en la primera inconsistencia.
 */
export function verifyChain(
  rows: Array<Pick<
    AuditEntryStored,
    | 'sequenceNum'
    | 'previousHash'
    | 'currentHash'
    | 'payloadHash'
    | 'actorId'
    | 'action'
    | 'targetType'
    | 'targetId'
    | 'outcome'
    | 'occurredAt'
  >>,
  expectedFirstPreviousHash: string = GENESIS_HASH,
): ChainVerificationResult {
  let prev = expectedFirstPreviousHash;
  for (const row of rows) {
    if (row.previousHash !== prev) {
      return {
        ok: false,
        totalChecked: rows.indexOf(row) + 1,
        brokenAt: {
          sequenceNum: row.sequenceNum,
          reason: `previousHash no coincide con currentHash anterior (esperado ${prev}, hallado ${row.previousHash})`,
        },
      };
    }
    const recomputed = computeRowHash({
      previousHash: row.previousHash,
      payloadHash: row.payloadHash,
      actorId: row.actorId,
      action: row.action,
      targetType: row.targetType,
      targetId: row.targetId,
      outcome: row.outcome,
      occurredAt: row.occurredAt,
    });
    if (recomputed !== row.currentHash) {
      return {
        ok: false,
        totalChecked: rows.indexOf(row) + 1,
        brokenAt: {
          sequenceNum: row.sequenceNum,
          reason: 'currentHash recomputado no coincide con el almacenado',
        },
      };
    }
    prev = row.currentHash;
  }
  return { ok: true, totalChecked: rows.length };
}

/**
 * Serialización canónica determinística (orden de keys ascendente).
 */
function canonicalize(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(',')}]`;
  }
  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
    a.localeCompare(b),
  );
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonicalize(v)}`).join(',')}}`;
}
