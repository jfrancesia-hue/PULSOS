/**
 * Aplica triggers SQL custom que viven fuera de las migrations de Prisma:
 *  - append_only_audit: prohíbe UPDATE/DELETE en AuditLog.
 *
 * Idempotente: usa CREATE OR REPLACE FUNCTION + DROP TRIGGER IF EXISTS.
 * Correr después de `prisma migrate dev` o `prisma migrate deploy`.
 */

import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import pg from 'pg';

const SQL_FILES = ['append_only_audit.sql'];

async function main() {
  const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!url) {
    console.error('❌ DATABASE_URL/DIRECT_URL no configurada.');
    process.exit(1);
  }

  const client = new pg.Client({ connectionString: url });
  await client.connect();

  for (const file of SQL_FILES) {
    const path = join(__dirname, 'sql', file);
    const sql = readFileSync(path, 'utf8');
    console.log(`▶ Aplicando ${file}…`);
    await client.query(sql);
    console.log(`  ✅ ${file}`);
  }

  await client.end();
  console.log('🎯 Triggers aplicados.');
}

main().catch((err) => {
  console.error('❌ Error aplicando triggers:', err);
  process.exit(1);
});
