import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __pulsoPrisma: PrismaClient | undefined;
}

function buildClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL no está definido. Copiar .env.example y completar.');
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

export const prisma: PrismaClient =
  globalThis.__pulsoPrisma ?? (globalThis.__pulsoPrisma = buildClient());

if (process.env.NODE_ENV !== 'production') {
  globalThis.__pulsoPrisma = prisma;
}

export * from '@prisma/client';
export type { PrismaClient } from '@prisma/client';
