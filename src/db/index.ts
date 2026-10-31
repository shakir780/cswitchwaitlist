import "server-only";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

type Db = NodePgDatabase<typeof schema>;

// Reuse one pool across hot reloads in dev, and across invocations of a warm serverless function.
const globalForDb = globalThis as unknown as { db?: Db };

/** Connects lazily, so pages that never touch the database build without DATABASE_URL. */
export function getDb(): Db {
  if (globalForDb.db) return globalForDb.db;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");

  const pool = new Pool({ connectionString, max: 5 });
  globalForDb.db = drizzle({ client: pool, schema, casing: "snake_case" });
  return globalForDb.db;
}

export { schema };
