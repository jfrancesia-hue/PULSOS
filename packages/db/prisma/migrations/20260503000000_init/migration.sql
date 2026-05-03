-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CIUDADANO', 'PROFESIONAL', 'FARMACIA', 'INSTITUCION', 'ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "SexoBiologico" AS ENUM ('MASCULINO', 'FEMENINO', 'INTERSEXUAL');

-- CreateEnum
CREATE TYPE "GeneroAutopercibido" AS ENUM ('MASCULINO', 'FEMENINO', 'NO_BINARIO', 'OTRO', 'PREFIERE_NO_DECIR');

-- CreateEnum
CREATE TYPE "ProvinciaAr" AS ENUM ('CABA', 'BUENOS_AIRES', 'CATAMARCA', 'CHACO', 'CHUBUT', 'CORDOBA', 'CORRIENTES', 'ENTRE_RIOS', 'FORMOSA', 'JUJUY', 'LA_PAMPA', 'LA_RIOJA', 'MENDOZA', 'MISIONES', 'NEUQUEN', 'RIO_NEGRO', 'SALTA', 'SAN_JUAN', 'SAN_LUIS', 'SANTA_CRUZ', 'SANTA_FE', 'SANTIAGO_DEL_ESTERO', 'TIERRA_DEL_FUEGO', 'TUCUMAN');

-- CreateEnum
CREATE TYPE "GrupoSanguineo" AS ENUM ('A_POSITIVO', 'A_NEGATIVO', 'B_POSITIVO', 'B_NEGATIVO', 'AB_POSITIVO', 'AB_NEGATIVO', 'O_POSITIVO', 'O_NEGATIVO', 'DESCONOCIDO');

-- CreateEnum
CREATE TYPE "CoberturaTipo" AS ENUM ('OBRA_SOCIAL', 'PREPAGA', 'PUBLICA', 'NINGUNA');

-- CreateEnum
CREATE TYPE "EspecialidadMedica" AS ENUM ('CLINICA_MEDICA', 'PEDIATRIA', 'GINECOLOGIA', 'CARDIOLOGIA', 'TRAUMATOLOGIA', 'DERMATOLOGIA', 'PSIQUIATRIA', 'NEUROLOGIA', 'CIRUGIA_GENERAL', 'EMERGENTOLOGIA', 'ANESTESIOLOGIA', 'RADIOLOGIA', 'OFTALMOLOGIA', 'OTORRINO', 'KINESIOLOGIA', 'BIOQUIMICA', 'ENFERMERIA', 'NUTRICION', 'ODONTOLOGIA', 'OTRA');

-- CreateEnum
CREATE TYPE "InstitutionType" AS ENUM ('HOSPITAL_PUBLICO', 'HOSPITAL_PRIVADO', 'CLINICA', 'CENTRO_SALUD', 'LABORATORIO', 'FARMACIA', 'OBRA_SOCIAL', 'PREPAGA', 'MINISTERIO', 'OTRO');

-- CreateEnum
CREATE TYPE "EmergencyTtl" AS ENUM ('H_24', 'D_7', 'D_30', 'NUNCA');

-- CreateEnum
CREATE TYPE "ClinicalEventType" AS ENUM ('CONSULTA', 'EVOLUCION', 'ESTUDIO', 'INTERNACION', 'CIRUGIA', 'VACUNACION', 'RECETA', 'DERIVACION', 'OTRO');

-- CreateEnum
CREATE TYPE "ClinicalDocumentType" AS ENUM ('ESTUDIO_LAB', 'ESTUDIO_IMAGEN', 'RECETA', 'INDICACION', 'INFORME', 'CERTIFICADO', 'CONSENTIMIENTO', 'OTRO');

-- CreateEnum
CREATE TYPE "ConsentScope" AS ENUM ('PERFIL_BASICO', 'PERFIL_COMPLETO', 'TIMELINE_CLINICO', 'CARGA_EVOLUCION', 'EMERGENCIA');

-- CreateEnum
CREATE TYPE "ConsentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "MicaTriage" AS ENUM ('INFORMATIVO', 'CONSULTA_NO_URGENTE', 'CONSULTA_PRIORITARIA', 'GUARDIA_INMEDIATA');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('AUTH_LOGIN_SUCCESS', 'AUTH_LOGIN_FAILURE', 'AUTH_LOGOUT', 'AUTH_MFA_CHALLENGE', 'AUTH_PASSWORD_RESET', 'PROFILE_VIEW', 'PROFILE_UPDATE', 'EMERGENCY_QR_GENERATED', 'EMERGENCY_QR_REVOKED', 'EMERGENCY_QR_ACCESSED', 'CLINICAL_RECORD_CREATED', 'CLINICAL_RECORD_UPDATED', 'CLINICAL_RECORD_VIEWED', 'CLINICAL_DOCUMENT_UPLOADED', 'CLINICAL_DOCUMENT_DOWNLOADED', 'CONSENT_GRANTED', 'CONSENT_REVOKED', 'CONSENT_EXPIRED', 'MICA_CONVERSATION_STARTED', 'MICA_PRESCRIPTION_BLOCKED', 'ADMIN_USER_SUSPENDED', 'ADMIN_USER_ROLE_CHANGED', 'ADMIN_AUDIT_VERIFIED', 'CONNECT_API_INVOKED');

-- CreateEnum
CREATE TYPE "AuditOutcome" AS ENUM ('SUCCESS', 'FAILURE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'PUSH', 'WHATSAPP', 'IN_APP');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'READ');

-- CreateEnum
CREATE TYPE "NotificationCategory" AS ENUM ('EMERGENCY_QR_ACCESSED', 'CONSENT_REQUEST', 'CONSENT_GRANTED', 'CLINICAL_RECORD_ADDED', 'PRESCRIPTION_ISSUED', 'MEDICATION_REMINDER', 'EMAIL_VERIFICATION', 'PASSWORD_RESET', 'WELCOME', 'OTHER');

-- CreateEnum
CREATE TYPE "ReminderFrequency" AS ENUM ('DAILY', 'TWICE_DAILY', 'THREE_TIMES_DAILY', 'EVERY_8H', 'EVERY_12H', 'WEEKLY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "PrescriptionStatus" AS ENUM ('EMITIDA', 'DISPENSADA', 'PARCIALMENTE_DISPENSADA', 'ANULADA', 'EXPIRADA');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CIUDADANO',
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "mfaSecret" TEXT,
    "emailVerifiedAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "failedLoginCount" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailVerificationToken" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "userAgent" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CitizenProfile" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "dni" TEXT NOT NULL,
    "cuil" TEXT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "fechaNacimiento" DATE NOT NULL,
    "sexoBiologico" "SexoBiologico" NOT NULL,
    "generoAutopercibido" "GeneroAutopercibido",
    "provincia" "ProvinciaAr" NOT NULL,
    "localidad" TEXT,
    "telefono" TEXT,
    "contactoEmergencia" JSONB,
    "cobertura" JSONB,
    "grupoSanguineo" "GrupoSanguineo" NOT NULL DEFAULT 'DESCONOCIDO',
    "alergias" JSONB NOT NULL DEFAULT '[]',
    "condicionesCriticas" JSONB NOT NULL DEFAULT '[]',
    "medicacionHabitual" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CitizenProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalProfile" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "matriculaNacional" TEXT,
    "matriculaProvincial" TEXT,
    "provinciaMatricula" "ProvinciaAr",
    "especialidades" "EspecialidadMedica"[] DEFAULT ARRAY[]::"EspecialidadMedica"[],
    "verificadoAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfessionalProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" UUID NOT NULL,
    "cuit" TEXT NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "fantasyName" TEXT,
    "tipo" "InstitutionType" NOT NULL,
    "provincia" "ProvinciaAr" NOT NULL,
    "localidad" TEXT,
    "direccion" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "verificadoAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstitutionMembership" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "institutionId" UUID NOT NULL,
    "rolEnInstitucion" TEXT NOT NULL,
    "desde" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hasta" TIMESTAMP(3),

    CONSTRAINT "InstitutionMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmergencyAccess" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "ttl" "EmergencyTtl" NOT NULL DEFAULT 'H_24',
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmergencyAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmergencyAccessLog" (
    "id" UUID NOT NULL,
    "emergencyAccessId" UUID NOT NULL,
    "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT,
    "userAgent" TEXT,
    "geoApprox" TEXT,
    "notifiedAt" TIMESTAMP(3),

    CONSTRAINT "EmergencyAccessLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalRecord" (
    "id" UUID NOT NULL,
    "ciudadanoId" UUID NOT NULL,
    "profesionalId" UUID,
    "institucionId" UUID,
    "tipo" "ClinicalEventType" NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "ocurridoEn" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalDocument" (
    "id" UUID NOT NULL,
    "ciudadanoId" UUID NOT NULL,
    "recordId" UUID,
    "tipo" "ClinicalDocumentType" NOT NULL,
    "nombre" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "hashSha256" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" UUID NOT NULL,

    CONSTRAINT "ClinicalDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consent" (
    "id" UUID NOT NULL,
    "ciudadanoId" UUID NOT NULL,
    "profesionalId" UUID,
    "institucionId" UUID,
    "scopes" "ConsentScope"[],
    "motivo" TEXT NOT NULL,
    "status" "ConsentStatus" NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grantedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,

    CONSTRAINT "Consent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MicaConversation" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "lastTriage" "MicaTriage",
    "derivacion" TEXT,
    "prescriptionFlagged" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MicaConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentEmbedding" (
    "id" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "modelo" TEXT NOT NULL,
    "embedding" vector(1536) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentEmbedding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" UUID NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorId" UUID,
    "actorRole" "Role",
    "action" "AuditAction" NOT NULL,
    "targetType" TEXT,
    "targetId" TEXT,
    "outcome" "AuditOutcome" NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "payloadHash" CHAR(64) NOT NULL,
    "previousHash" CHAR(64) NOT NULL,
    "currentHash" CHAR(64) NOT NULL,
    "sequenceNum" BIGSERIAL NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "category" "NotificationCategory" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "payload" JSONB,
    "sentAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "errorMsg" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicationReminder" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "medicacion" TEXT NOT NULL,
    "presentacion" TEXT,
    "posologia" TEXT,
    "frequency" "ReminderFrequency" NOT NULL,
    "cronExpression" TEXT,
    "hours" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastFiredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicationReminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" UUID NOT NULL,
    "ciudadanoId" UUID NOT NULL,
    "profesionalId" UUID NOT NULL,
    "institucionId" UUID,
    "diagnostico" TEXT,
    "notas" TEXT,
    "status" "PrescriptionStatus" NOT NULL DEFAULT 'EMITIDA',
    "emitidaEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validaHasta" TIMESTAMP(3) NOT NULL,
    "dispensadaEn" TIMESTAMP(3),
    "signatureHash" CHAR(64) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrescriptionItem" (
    "id" UUID NOT NULL,
    "prescriptionId" UUID NOT NULL,
    "medicacion" TEXT NOT NULL,
    "presentacion" TEXT,
    "posologia" TEXT NOT NULL,
    "cantidad" TEXT,
    "duracionDias" INTEGER,
    "observaciones" TEXT,

    CONSTRAINT "PrescriptionItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationToken_tokenHash_key" ON "EmailVerificationToken"("tokenHash");

-- CreateIndex
CREATE INDEX "EmailVerificationToken_userId_idx" ON "EmailVerificationToken"("userId");

-- CreateIndex
CREATE INDEX "EmailVerificationToken_expiresAt_idx" ON "EmailVerificationToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

-- CreateIndex
CREATE INDEX "PasswordResetToken_expiresAt_idx" ON "PasswordResetToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "CitizenProfile_userId_key" ON "CitizenProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CitizenProfile_dni_key" ON "CitizenProfile"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "CitizenProfile_cuil_key" ON "CitizenProfile"("cuil");

-- CreateIndex
CREATE INDEX "CitizenProfile_dni_idx" ON "CitizenProfile"("dni");

-- CreateIndex
CREATE INDEX "CitizenProfile_provincia_idx" ON "CitizenProfile"("provincia");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalProfile_userId_key" ON "ProfessionalProfile"("userId");

-- CreateIndex
CREATE INDEX "ProfessionalProfile_matriculaNacional_idx" ON "ProfessionalProfile"("matriculaNacional");

-- CreateIndex
CREATE UNIQUE INDEX "Institution_cuit_key" ON "Institution"("cuit");

-- CreateIndex
CREATE INDEX "Institution_provincia_idx" ON "Institution"("provincia");

-- CreateIndex
CREATE INDEX "Institution_tipo_idx" ON "Institution"("tipo");

-- CreateIndex
CREATE INDEX "InstitutionMembership_institutionId_idx" ON "InstitutionMembership"("institutionId");

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionMembership_userId_institutionId_key" ON "InstitutionMembership"("userId", "institutionId");

-- CreateIndex
CREATE UNIQUE INDEX "EmergencyAccess_token_key" ON "EmergencyAccess"("token");

-- CreateIndex
CREATE INDEX "EmergencyAccess_userId_idx" ON "EmergencyAccess"("userId");

-- CreateIndex
CREATE INDEX "EmergencyAccess_token_idx" ON "EmergencyAccess"("token");

-- CreateIndex
CREATE INDEX "EmergencyAccessLog_emergencyAccessId_idx" ON "EmergencyAccessLog"("emergencyAccessId");

-- CreateIndex
CREATE INDEX "EmergencyAccessLog_accessedAt_idx" ON "EmergencyAccessLog"("accessedAt");

-- CreateIndex
CREATE INDEX "ClinicalRecord_ciudadanoId_ocurridoEn_idx" ON "ClinicalRecord"("ciudadanoId", "ocurridoEn" DESC);

-- CreateIndex
CREATE INDEX "ClinicalRecord_profesionalId_idx" ON "ClinicalRecord"("profesionalId");

-- CreateIndex
CREATE INDEX "ClinicalRecord_institucionId_idx" ON "ClinicalRecord"("institucionId");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicalDocument_storageKey_key" ON "ClinicalDocument"("storageKey");

-- CreateIndex
CREATE INDEX "ClinicalDocument_ciudadanoId_idx" ON "ClinicalDocument"("ciudadanoId");

-- CreateIndex
CREATE INDEX "ClinicalDocument_recordId_idx" ON "ClinicalDocument"("recordId");

-- CreateIndex
CREATE INDEX "Consent_ciudadanoId_status_expiresAt_idx" ON "Consent"("ciudadanoId", "status", "expiresAt");

-- CreateIndex
CREATE INDEX "Consent_profesionalId_idx" ON "Consent"("profesionalId");

-- CreateIndex
CREATE INDEX "MicaConversation_userId_startedAt_idx" ON "MicaConversation"("userId", "startedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "DocumentEmbedding_documentId_key" ON "DocumentEmbedding"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "AuditLog_currentHash_key" ON "AuditLog"("currentHash");

-- CreateIndex
CREATE UNIQUE INDEX "AuditLog_sequenceNum_key" ON "AuditLog"("sequenceNum");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_occurredAt_idx" ON "AuditLog"("actorId", "occurredAt" DESC);

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_occurredAt_idx" ON "AuditLog"("occurredAt" DESC);

-- CreateIndex
CREATE INDEX "AuditLog_targetType_targetId_idx" ON "AuditLog"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Notification_status_idx" ON "Notification"("status");

-- CreateIndex
CREATE INDEX "Notification_category_idx" ON "Notification"("category");

-- CreateIndex
CREATE INDEX "MedicationReminder_userId_active_idx" ON "MedicationReminder"("userId", "active");

-- CreateIndex
CREATE INDEX "MedicationReminder_active_lastFiredAt_idx" ON "MedicationReminder"("active", "lastFiredAt");

-- CreateIndex
CREATE INDEX "Prescription_ciudadanoId_emitidaEn_idx" ON "Prescription"("ciudadanoId", "emitidaEn" DESC);

-- CreateIndex
CREATE INDEX "Prescription_profesionalId_idx" ON "Prescription"("profesionalId");

-- CreateIndex
CREATE INDEX "Prescription_status_idx" ON "Prescription"("status");

-- CreateIndex
CREATE INDEX "PrescriptionItem_prescriptionId_idx" ON "PrescriptionItem"("prescriptionId");

-- AddForeignKey
ALTER TABLE "EmailVerificationToken" ADD CONSTRAINT "EmailVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CitizenProfile" ADD CONSTRAINT "CitizenProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalProfile" ADD CONSTRAINT "ProfessionalProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionMembership" ADD CONSTRAINT "InstitutionMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionMembership" ADD CONSTRAINT "InstitutionMembership_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyAccess" ADD CONSTRAINT "EmergencyAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyAccessLog" ADD CONSTRAINT "EmergencyAccessLog_emergencyAccessId_fkey" FOREIGN KEY ("emergencyAccessId") REFERENCES "EmergencyAccess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalRecord" ADD CONSTRAINT "ClinicalRecord_ciudadanoId_fkey" FOREIGN KEY ("ciudadanoId") REFERENCES "CitizenProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalRecord" ADD CONSTRAINT "ClinicalRecord_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "ProfessionalProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalRecord" ADD CONSTRAINT "ClinicalRecord_institucionId_fkey" FOREIGN KEY ("institucionId") REFERENCES "Institution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalDocument" ADD CONSTRAINT "ClinicalDocument_ciudadanoId_fkey" FOREIGN KEY ("ciudadanoId") REFERENCES "CitizenProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalDocument" ADD CONSTRAINT "ClinicalDocument_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "ClinicalRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consent" ADD CONSTRAINT "Consent_ciudadanoId_fkey" FOREIGN KEY ("ciudadanoId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consent" ADD CONSTRAINT "Consent_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "ProfessionalProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consent" ADD CONSTRAINT "Consent_institucionId_fkey" FOREIGN KEY ("institucionId") REFERENCES "Institution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MicaConversation" ADD CONSTRAINT "MicaConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationReminder" ADD CONSTRAINT "MedicationReminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_ciudadanoId_fkey" FOREIGN KEY ("ciudadanoId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "ProfessionalProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_institucionId_fkey" FOREIGN KEY ("institucionId") REFERENCES "Institution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionItem" ADD CONSTRAINT "PrescriptionItem_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
