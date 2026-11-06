import { z } from "zod";

export type WaitlistStepOne = {
  fullName: string;
  email: string;
  phone: string;
  whatsappOptIn: boolean;
};

/**
 * Normalises a Nigerian mobile number to E.164 ("+2348031234567").
 * Accepts "8031234567", "08031234567", "803 123 4567" and "+234 803 123 4567".
 * Returns null when the input isn't a valid NG mobile number.
 */
export function normaliseNigerianPhone(input: string): string | null {
  let digits = input.replace(/\D/g, "");
  if (digits.length === 13 && digits.startsWith("234")) digits = digits.slice(3);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[789]\d{9}$/.test(digits) ? `+234${digits}` : null;
}

/** "+2348031234567" → "803 123 4567", for showing a stored number back in the input. */
export function formatNigerianPhone(e164: string): string {
  return e164.replace(/^\+234(\d{3})(\d{3})(\d{4})$/, "$1 $2 $3");
}

export const waitlistStepOneSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Enter your email address")
    .pipe(z.email("Enter a valid email address")),
  phone: z
    .string()
    .trim()
    .min(1, "Enter your phone number")
    .transform((value, ctx) => {
      const phone = normaliseNigerianPhone(value);
      if (!phone) {
        ctx.addIssue({ code: "custom", message: "Enter a valid Nigerian mobile number" });
        return z.NEVER;
      }
      return phone;
    }),
  whatsappOptIn: z.boolean(),
}) satisfies z.ZodType<WaitlistStepOne, unknown>;

export type WaitlistStepOneInput = z.input<typeof waitlistStepOneSchema>;

export const businessCategories = [
  "Shop or restaurant",
  "Retail or wholesale",
  "Online store",
  "Fashion and beauty",
  "Health and pharmacy",
  "Logistics and transport",
  "Professional services",
  "Education",
  "Other",
] as const;

export const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara",
] as const;

export const referralSources = [
  "SMEDAN",
  "Instagram",
  "X (Twitter)",
  "WhatsApp",
  "Friend or colleague",
  "Google search",
  "Other",
] as const;

type Options = readonly [string, ...string[]];

// <select>s start as "", so both helpers take any string in and narrow it.
const requiredChoice = <T extends Options>(options: T, message: string) =>
  z.string().pipe(z.enum(options, { error: message }));

/** Optional <select>: "" (nothing chosen) becomes undefined. */
const optionalChoice = <T extends Options>(options: T) =>
  z
    .string()
    .pipe(z.union([z.enum(options), z.literal("")]))
    .transform((value) => value || undefined);

export const waitlistStepTwoSchema = z.object({
  businessName: z.string().trim().min(2, "Enter your business name"),
  category: requiredChoice(businessCategories, "Choose a category"),
  state: requiredChoice(nigerianStates, "Choose a state"),
  heardFrom: optionalChoice(referralSources),
  consent: z.boolean().refine(Boolean, "Please agree to continue"),
});

export type WaitlistStepTwo = z.output<typeof waitlistStepTwoSchema>;
export type WaitlistStepTwoInput = z.input<typeof waitlistStepTwoSchema>;

export type WaitlistSubmission = WaitlistStepOne & WaitlistStepTwo;

/**
 * Re-checks a full submission on the server. The form sends already-parsed values,
 * so an unanswered optional select arrives as undefined rather than "".
 */
export const waitlistSubmissionSchema = waitlistStepOneSchema.extend({
  ...waitlistStepTwoSchema.shape,
  heardFrom: z.enum(referralSources).optional(),
});

export type ValidatedSubmission = z.output<typeof waitlistSubmissionSchema>;

export type WaitlistResult = {
  position: number;
  referralUrl: string;
  /** Whether a confirmation email is being sent, so the success screen only promises that. */
  confirmationEmail: boolean;
};
