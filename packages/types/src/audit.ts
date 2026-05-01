import { z } from 'zod';

export const auditActionSchema = z.enum([
  'AUTH_LOGIN_SUCCESS',
  'AUTH_LOGIN_FAILURE',
  'AUTH_LOGOUT',
  'AUTH_MFA_CHALLENGE',
  'AUTH_PASSWORD_RESET',
  'PROFILE_VIEW',
  'PROFILE_UPDATE',
  'EMERGENCY_QR_GENERATED',
  'EMERGENCY_QR_REVOKED',
  'EMERGENCY_QR_ACCESSED',
  'CLINICAL_RECORD_CREATED',
  'CLINICAL_RECORD_UPDATED',
  'CLINICAL_RECORD_VIEWED',
  'CLINICAL_DOCUMENT_UPLOADED',
  'CLINICAL_DOCUMENT_DOWNLOADED',
  'CONSENT_GRANTED',
  'CONSENT_REVOKED',
  'CONSENT_EXPIRED',
  'MICA_CONVERSATION_STARTED',
  'MICA_PRESCRIPTION_BLOCKED',
  'ADMIN_USER_SUSPENDED',
  'ADMIN_USER_ROLE_CHANGED',
  'ADMIN_AUDIT_VERIFIED',
  'CONNECT_API_INVOKED',
]);
export type AuditAction = z.infer<typeof auditActionSchema>;

export const auditOutcomeSchema = z.enum(['SUCCESS', 'FAILURE', 'BLOCKED']);
export type AuditOutcome = z.infer<typeof auditOutcomeSchema>;

export const auditEntrySchema = z.object({
  id: z.string().uuid(),
  occurredAt: z.string().datetime(),
  actorId: z.string().uuid().nullable(),
  actorRole: z.string().nullable(),
  action: auditActionSchema,
  targetType: z.string().nullable(),
  targetId: z.string().nullable(),
  outcome: auditOutcomeSchema,
  payloadHash: z.string().regex(/^[0-9a-f]{64}$/),
  previousHash: z.string().regex(/^[0-9a-f]{64}$/),
  currentHash: z.string().regex(/^[0-9a-f]{64}$/),
});
export type AuditEntry = z.infer<typeof auditEntrySchema>;
