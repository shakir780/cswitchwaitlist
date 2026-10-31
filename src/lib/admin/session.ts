import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";

const COOKIE = "cswitch_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12;

/**
 * A signed "admin.<expiry>" cookie. The signing key includes ADMIN_PASSWORD, so
 * changing the password signs everyone out.
 */
export async function createAdminSession() {
  const payload = `admin.${Date.now() + MAX_AGE_SECONDS * 1000}`;
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession() {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}

export async function hasAdminSession(): Promise<boolean> {
  // Checking expiry reads the clock, which must happen at request time, not during prerender.
  await connection();
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;

  const dot = value.lastIndexOf(".");
  const payload = value.slice(0, dot);
  if (dot < 0 || !safeEqual(value.slice(dot + 1), sign(payload))) return false;

  return Number(payload.split(".")[1]) > Date.now();
}

/** Call at the top of anything that shows or returns admin data. */
export async function requireAdmin() {
  if (!(await hasAdminSession())) redirect("/admin/login");
}

export function isCorrectPassword(input: string) {
  return safeEqual(input, env().ADMIN_PASSWORD);
}

function sign(payload: string) {
  const { SESSION_SECRET, ADMIN_PASSWORD } = env();
  return createHmac("sha256", `${SESSION_SECRET}:${ADMIN_PASSWORD}`)
    .update(payload)
    .digest("base64url");
}

/** Constant-time comparison that also hides the length of the expected value. */
function safeEqual(a: string, b: string) {
  const hash = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(hash(a), hash(b));
}
