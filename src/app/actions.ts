"use server";

import { after } from "next/server";
import { cookies, headers } from "next/headers";
import {
  waitlistStepOneSchema,
  waitlistSubmissionSchema,
  type WaitlistResult,
  type WaitlistStepOne,
  type WaitlistSubmission,
} from "@/lib/validation/waitlist";
import { siteUrlSetting } from "@/lib/env";
import { sendConfirmations, willSendConfirmationEmail } from "@/lib/notifications/confirmations";
import { REFERRAL_COOKIE } from "@/lib/waitlist/referrals";
import { completeSignup, saveStepOne } from "@/lib/waitlist/signups";

// Server actions are public endpoints, so both re-validate instead of trusting the form.

export async function submitStepOne(input: WaitlistStepOne): Promise<void> {
  const data = waitlistStepOneSchema.parse(input);
  await saveStepOne(data, await referralCookie());
}

export async function submitWaitlist(input: WaitlistSubmission): Promise<WaitlistResult> {
  const data = waitlistSubmissionSchema.parse(input);
  const { referralCode, position } = await completeSignup(data, await referralCookie());
  const referralUrl = `${await siteUrl()}/w/${referralCode}`;

  // Sent once the response is out, so a slow provider never delays the success screen.
  const firstName = data.fullName.split(/\s+/)[0];
  after(() => sendConfirmations(data.email, { firstName, position, referralUrl }));

  return { position, referralUrl, confirmationEmail: willSendConfirmationEmail() };
}

async function referralCookie() {
  return (await cookies()).get(REFERRAL_COOKIE)?.value;
}

async function siteUrl() {
  const configured = siteUrlSetting();
  if (configured) return configured;
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "https";
  return `${protocol}://${host}`;
}
