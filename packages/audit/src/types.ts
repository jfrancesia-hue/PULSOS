import type { AuditAction, AuditOutcome, Role } from '@pulso/types';

export interface AuditEntryInput {
  actorId: string | null;
  actorRole: Role | null;
  action: AuditAction;
  targetType: string | null;
  targetId: string | null;
  outcome: AuditOutcome;
  ip?: string | null;
  userAgent?: string | null;
  payload: Record<string, unknown>;
}

export interface AuditEntryStored extends Omit<AuditEntryInput, 'payload'> {
  id: string;
  occurredAt: string;
  payloadHash: string;
  previousHash: string;
  currentHash: string;
  sequenceNum: bigint;
}

export interface ChainVerificationResult {
  ok: boolean;
  totalChecked: number;
  brokenAt?: { sequenceNum: bigint; reason: string };
}
