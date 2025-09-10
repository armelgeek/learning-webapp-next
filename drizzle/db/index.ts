import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

import * as schema from '@/drizzle/schema';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Extract the path from sqlite: URL
const dbPath = process.env.DATABASE_URL.replace('sqlite:', '');
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
