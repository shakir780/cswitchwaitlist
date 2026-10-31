import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

// Read DATABASE_URL from .env.local the same way `next dev` does.
loadEnvConfig(process.cwd());

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  casing: "snake_case",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
