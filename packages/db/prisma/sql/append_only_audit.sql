-- =====================================================================
--  Pulso · Audit log append-only
--  Esta migration debe correrse manualmente DESPUÉS del primer
--  `prisma migrate dev`. Garantiza que la tabla AuditLog no acepte
--  UPDATE ni DELETE a nivel de la base de datos, no del código.
-- =====================================================================

CREATE OR REPLACE FUNCTION pulso_audit_block_modify()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'AuditLog es append-only. UPDATE y DELETE están prohibidos.'
    USING ERRCODE = 'check_violation';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS pulso_audit_no_update ON "AuditLog";
DROP TRIGGER IF EXISTS pulso_audit_no_delete ON "AuditLog";

CREATE TRIGGER pulso_audit_no_update
BEFORE UPDATE ON "AuditLog"
FOR EACH ROW EXECUTE FUNCTION pulso_audit_block_modify();

CREATE TRIGGER pulso_audit_no_delete
BEFORE DELETE ON "AuditLog"
FOR EACH ROW EXECUTE FUNCTION pulso_audit_block_modify();

-- Permite TRUNCATE solo en entorno de desarrollo (el seed lo necesita).
-- En producción se debe DROP este trigger antes de cualquier mantenimiento legítimo.
