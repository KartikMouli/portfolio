import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEONDB_DATABASE_URL as string);
export const db = drizzle(sql); 