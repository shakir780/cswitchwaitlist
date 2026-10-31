ALTER TABLE "waitlist_signups" ADD COLUMN "email_sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "waitlist_signups" ADD COLUMN "email_error" text;