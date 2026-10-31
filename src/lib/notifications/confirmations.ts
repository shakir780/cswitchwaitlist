import "server-only";
import { and, eq, isNotNull, isNull, sql } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { emailConfig } from "@/lib/env";
import { sendConfirmationEmail } from "./email";

const { waitlistSignups: signups } = schema;

export type Confirmation = { firstName: string; position: number; referralUrl: string };

/** Whether a confirmation email will go out, so the success screen only promises what's real. */
export function willSendConfirmationEmail() {
  return emailConfig() !== null;
}

/**
 * Sends the confirmation email for a completed signup, at most once. The send is claimed
 * with a conditional UPDATE first, so double submits or concurrent requests can't email
 * twice. A failed send releases the claim and records the error for the admin page.
 * Never throws: a delivery problem must not affect the signup itself.
 */
export async function sendConfirmations(email: string, confirmation: Confirmation) {
  if (!emailConfig()) return;
  const db = getDb();

  try {
    const claimed = await db
      .update(signups)
      .set({ emailSentAt: sql`now()`, emailError: null })
      .where(
        and(eq(signups.email, email), isNotNull(signups.completedAt), isNull(signups.emailSentAt)),
      )
      .returning({ id: signups.id });
    if (claimed.length === 0) return;

    try {
      await sendConfirmationEmail(email, confirmation);
    } catch (error) {
      console.error("Confirmation email failed", { email, error });
      await db
        .update(signups)
        .set({ emailSentAt: null, emailError: errorMessage(error) })
        .where(eq(signups.email, email));
    }
  } catch (error) {
    console.error("Confirmation email bookkeeping failed", { email, error });
  }
}

function errorMessage(error: unknown) {
  return (error instanceof Error ? error.message : String(error)).slice(0, 500);
}
