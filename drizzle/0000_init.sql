CREATE TABLE "waitlist_signups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"whatsapp_opt_in" boolean NOT NULL,
	"business_name" text,
	"category" text,
	"state" text,
	"monthly_sales" text,
	"needs" text[],
	"branches" text,
	"heard_from" text,
	"referral_code" text NOT NULL,
	"referred_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	CONSTRAINT "waitlist_signups_email_unique" UNIQUE("email"),
	CONSTRAINT "waitlist_signups_referralCode_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE INDEX "waitlist_signups_created_at_index" ON "waitlist_signups" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "waitlist_signups_completed_at_index" ON "waitlist_signups" USING btree ("completed_at");--> statement-breakpoint
CREATE INDEX "waitlist_signups_referred_by_index" ON "waitlist_signups" USING btree ("referred_by");