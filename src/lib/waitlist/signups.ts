import "server-only";
import { and, count, eq, isNotNull, lte, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { DatabaseError } from "pg";
import { getDb, schema } from "@/db";
import type { ValidatedSubmission, WaitlistStepOne } from "@/lib/validation/waitlist";
import { generateReferralCode, REFERRAL_CODE_PATTERN } from "./referrals";

const { waitlistSignups: signups } = schema;

/** Creates the row on step one, or refreshes the contact details if this email already started. */
export async function saveStepOne(data: WaitlistStepOne, referralCookie?: string) {
  const referredBy = await findReferrer(referralCookie);

  await withFreshReferralCode(data.fullName, (referralCode) =>
    getDb()
      .insert(signups)
      .values({ ...data, referralCode, referredBy })
      .onConflictDoUpdate({
        target: signups.email,
        set: {
          fullName: data.fullName,
          phone: data.phone,
          whatsappOptIn: data.whatsappOptIn,
          updatedAt: sql`now()`,
        },
      }),
  );
}

/**
 * Saves the full submission and returns the signup's place in line. Submitting again
 * with the same email updates the details but keeps the original place and code.
 */
export async function completeSignup(data: ValidatedSubmission, referralCookie?: string) {
  const referredBy = await findReferrer(referralCookie);
  const details = {
    fullName: data.fullName,
    phone: data.phone,
    whatsappOptIn: data.whatsappOptIn,
    businessName: data.businessName,
    category: data.category,
    state: data.state,
    monthlySales: data.monthlySales,
    needs: data.needs,
    branches: data.branches ?? null,
    heardFrom: data.heardFrom ?? null,
  };

  const [row] = await withFreshReferralCode(data.fullName, (referralCode) =>
    getDb()
      .insert(signups)
      .values({ ...details, email: data.email, referralCode, referredBy, completedAt: sql`now()` })
      .onConflictDoUpdate({
        target: signups.email,
        set: {
          ...details,
          updatedAt: sql`now()`,
          completedAt: sql`coalesce(${signups.completedAt}, now())`,
        },
      })
      .returning({ referralCode: signups.referralCode }),
  );

  // Compared inside Postgres: JS Dates drop the microseconds, which would exclude this row itself.
  const self = alias(signups, "self");
  const [{ position }] = await getDb()
    .select({ position: count() })
    .from(signups)
    .innerJoin(self, eq(self.email, data.email))
    .where(and(isNotNull(signups.completedAt), lte(signups.completedAt, self.completedAt)));

  return { referralCode: row.referralCode, position };
}

async function findReferrer(code?: string) {
  if (!code || !REFERRAL_CODE_PATTERN.test(code)) return null;
  const [referrer] = await getDb()
    .select({ code: signups.referralCode })
    .from(signups)
    .where(eq(signups.referralCode, code))
    .limit(1);
  return referrer?.code ?? null;
}

/** Retries with a new code in the (very unlikely) event a generated one is already taken. */
async function withFreshReferralCode<T>(
  fullName: string,
  write: (referralCode: string) => Promise<T>,
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await write(generateReferralCode(fullName));
    } catch (error) {
      // Drizzle wraps driver errors, so the Postgres error is on `cause`.
      const pgError = error instanceof Error && error.cause instanceof DatabaseError ? error.cause : error;
      const codeTaken =
        pgError instanceof DatabaseError &&
        pgError.code === "23505" &&
        pgError.constraint === "waitlist_signups_referralCode_unique";
      if (!codeTaken || attempt >= 4) throw error;
    }
  }
}
