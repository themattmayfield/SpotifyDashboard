import * as schema from '@/db/schema';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const url =
  process.env.TURSO_DATABASE_URL ??
  (process.env.NODE_ENV !== 'production' ? 'file:local.db' : undefined);
export const dbEnabled = () => Boolean(url);

let instance: ReturnType<typeof drizzle<typeof schema>> | undefined;
export function getDb() {
  if (!url) return null;
  instance ??= drizzle(
    createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN }),
    { schema }
  );
  return instance;
}
