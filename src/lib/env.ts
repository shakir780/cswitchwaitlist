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

/** Validated settings. Throws one error listing every problem, so a bad deploy fails loudly. */
export function env(): Env {
  if (cached) return cached;
  const result = schema.safeParse(process.env);
  if (!result.success) {
    const problems = result.error.issues.map((issue) => `  - ${issue.path.join(".")} ${issue.message}`);
    throw new Error(`Invalid environment variables:\n${problems.join("\n")}`);
  }
  cached = result.data;
  return cached;
}

export function emailConfig() {
  const { RESEND_API_KEY, EMAIL_FROM, EMAIL_REPLY_TO } = env();
  if (!RESEND_API_KEY || !EMAIL_FROM) return null;
  return { apiKey: RESEND_API_KEY, from: EMAIL_FROM, replyTo: EMAIL_REPLY_TO };
}
