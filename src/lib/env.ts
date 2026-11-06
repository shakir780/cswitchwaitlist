import "server-only";
import { z } from "zod";

const optional = z
  .string()
  .trim()
  .transform((value) => value || undefined)
  .optional();

const schema = z
  .object({
    DATABASE_URL: z.string().trim().min(1, "is required"),
    ADMIN_PASSWORD: z.string().min(12, "must be at least 12 characters"),
    SESSION_SECRET: z.string().min(32, "must be at least 32 characters"),
    SITE_URL: z.url("must be a full URL, e.g. https://cswitch.ng").optional().or(z.literal("")),

    // Confirmation email via Resend. Both or neither.
    RESEND_API_KEY: optional,
    EMAIL_FROM: optional,
    EMAIL_REPLY_TO: optional,
  })
  .superRefine((env, ctx) => {
    const allOrNone = (keys: (keyof typeof env)[]) => {
      const set = keys.filter((key) => env[key]);
      if (set.length > 0 && set.length < keys.length) {
        for (const key of keys.filter((key) => !env[key])) {
          ctx.addIssue({ code: "custom", path: [key], message: `is required when ${set.join(", ")} is set` });
        }
      }
    };
    allOrNone(["RESEND_API_KEY", "EMAIL_FROM"]);
  });

export type Env = z.output<typeof schema>;

let cached: Env | undefined;

/** Every problem with the current settings, e.g. "SESSION_SECRET must be at least 32 characters". */
export function envProblems(): string[] {
  const result = schema.safeParse(process.env);
  return result.success
    ? []
    : result.error.issues.map((issue) => `${issue.path.join(".")} ${issue.message}`);
}

/**
 * Validated settings, for admin code that genuinely needs all of them. Throws one error
 * listing every problem. Public signup code reads only what it needs, so a bad admin
 * setting can never take the waitlist form down.
 */
export function env(): Env {
  if (cached) return cached;
  const problems = envProblems();
  if (problems.length > 0) {
    throw new Error(`Invalid environment variables:\n${problems.map((p) => `  - ${p}`).join("\n")}`);
  }
  cached = schema.parse(process.env);
  return cached;
}

/** SITE_URL without a trailing slash, or null if it's unset or not a full URL. */
export function siteUrlSetting() {
  const value = process.env.SITE_URL?.trim();
  return value && URL.canParse(value) ? value.replace(/\/$/, "") : null;
}

/** Resend settings, or null when email is turned off or only half configured. */
export function emailConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  if (!apiKey || !from) return null;
  return { apiKey, from, replyTo: process.env.EMAIL_REPLY_TO?.trim() || undefined };
}
