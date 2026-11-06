import { sql } from "drizzle-orm";
import { getDb } from "@/db";
import { envProblems } from "@/lib/env";

/**
 * Plain-language status for deploy debugging: are the settings valid, can the app reach the
 * database, and do the tables exist. Shows setting names and database errors, never values.
 */
export async function GET() {
  const settings = envProblems();
  let database: string;
  try {
    await getDb().execute(sql`select 1 from waitlist_signups limit 1`);
    database = "ok";
  } catch (error) {
    // Drizzle wraps the driver error; the useful message is on `cause`.
    const cause = error instanceof Error && error.cause instanceof Error ? error.cause : error;
    database = cause instanceof Error ? cause.message : String(cause);
  }

  const ok = settings.length === 0 && database === "ok";
  return Response.json(
    {
      ok,
      settings: settings.length === 0 ? "ok" : settings,
      database,
      hint: ok
        ? "Everything the waitlist needs is working."
        : database.includes("does not exist")
          ? "The database is reachable but empty: run the migrations (npm run db:migrate) against it."
          : "Fix the items above in Vercel → Settings → Environment Variables, then redeploy.",
    },
    { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
