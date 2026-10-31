import { boolean, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * One row per email. Step one of the form creates the row; step two fills in the
 * business details and sets `completedAt`. Rows without `completedAt` are leads
 * who dropped off between the two steps.
 */
export const waitlistSignups = pgTable(
  "waitlist_signups",
  {
    id: uuid().primaryKey().defaultRandom(),

    fullName: text().notNull(),
    email: text().notNull().unique(),
    phone: text().notNull(),
    whatsappOptIn: boolean().notNull(),

    businessName: text(),
    category: text(),
    state: text(),
    monthlySales: text(),
    needs: text().array(),
    branches: text(),
    heardFrom: text(),

    referralCode: text().notNull().unique(),
    /** Referral code of the signup that referred this one. */
    referredBy: text(),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp({ withTimezone: true }),

    /** Set when the confirmation email is claimed for sending; cleared again if it fails. */
    emailSentAt: timestamp({ withTimezone: true }),
    emailError: text(),
  },
  (table) => [
    index().on(table.createdAt),
    index().on(table.completedAt),
    index().on(table.referredBy),
  ],
);

export type WaitlistSignup = typeof waitlistSignups.$inferSelect;
