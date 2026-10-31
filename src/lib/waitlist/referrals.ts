import { randomInt } from "node:crypto";

/** Holds the referral code from a /w/<code> visit until the visitor signs up. */
export const REFERRAL_COOKIE = "cswitch_ref";
export const REFERRAL_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export const REFERRAL_CODE_PATTERN = /^[a-z]{1,12}-[2-9a-z]{6}$/;

// No 0/o, 1/l/i, so codes survive being read aloud or retyped.
const ALPHABET = "23456789abcdefghjkmnpqrstuvwxyz";

/** "Adaeze Okonkwo" → "adaeze-7kq2mx" */
export function generateReferralCode(fullName: string): string {
  const slug =
    fullName
      .split(/\s+/)[0]
      .normalize("NFD")
      .toLowerCase()
      .replace(/[^a-z]/g, "")
      .slice(0, 12) || "cswitch";
  const suffix = Array.from({ length: 6 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
  return `${slug}-${suffix}`;
}
