import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

declare global {
  var __pulsoPrisma: PrismaClient | undefined;
}

function buildClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL no está definido. Copiar .env.example y completar.');
  }

  // Parseamos la URL para configurar SSL explícitamente.
  // Supabase usa self-signed cert chain; necesitamos rejectUnauthorized=false.
  const url = new URL(connectionString);
  const adapter = new PrismaPg({
    host: url.hostname,
    port: Number(url.port || '5432'),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, '') || 'postgres',
    ssl: shouldUseSsl(url) ? { rejectUnauthorized: false } : false,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

function shouldUseSsl(url: URL): boolean {
  // Supabase, RDS, Neon, etc. siempre con SSL. Local sin SSL.
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') return false;
  const sslmode = url.searchParams.get('sslmode');
  if (sslmode === 'disable') return false;
  return true;
}

export const prisma: PrismaClient =
  globalThis.__pulsoPrisma ?? (globalThis.__pulsoPrisma = buildClient());

if (process.env.NODE_ENV !== 'production') {
  globalThis.__pulsoPrisma = prisma;
}

export * from '@prisma/client';
export type { PrismaClient } from '@prisma/client';
