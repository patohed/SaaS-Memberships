import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';
import { validateEnvironment } from '@/lib/config/env-validator';

dotenv.config();

// Validar configuración de entorno en desarrollo
if (process.env.NODE_ENV !== 'production') {
  validateEnvironment();
}

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

// Verificar que la URL no sea un placeholder
if (process.env.POSTGRES_URL.includes('your-production-database-url') || 
    process.env.POSTGRES_URL.includes('demo@localhost')) {
  console.warn('⚠️  Using placeholder database URL - this will only work for build, not runtime');
}

export const client = postgres(process.env.POSTGRES_URL);
export const db = drizzle(client, { schema });
