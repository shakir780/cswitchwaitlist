# Deploying to Vercel

The app is a single Next.js project: the landing page, the waitlist API (server actions),
the admin page at `/admin/waitlist`, and the confirmation email all deploy together.

## 1. Database (Neon)

1. In the Vercel project, open **Storage → Marketplace → Neon** and create a database.
   Connect it to the project; this sets `DATABASE_URL` for Production, Preview and Development.
2. Create the tables from your machine, pointing at the new database:

   ```sh
   DATABASE_URL="<Neon connection string>" npm run db:migrate
   ```

   Run this again whenever a new file appears in `drizzle/`. Migrations only add to the
   schema and are safe to run more than once.

> Use a separate Neon branch for Preview deployments so test signups don't land in the
> production waitlist. The Neon integration can create one per preview automatically.

## 2. Confirmation email (Resend)

1. Create a Resend account and add your sending domain (e.g. `cswitch.ng`).
2. Add the DNS records Resend shows (SPF, DKIM, and optionally DMARC) at your DNS provider,
   and wait for Resend to mark the domain as verified. Until then, emails will fail.
3. Create an API key with "Sending access" only.

Leave `RESEND_API_KEY` and `EMAIL_FROM` unset to launch without email: signups still work,
and the success screen stops promising a confirmation.

## 3. Environment variables

Set these in **Project Settings → Environment Variables** (see `.env.example`):

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Set by the Neon integration. |
| `ADMIN_PASSWORD` | Yes | At least 12 characters. Changing it signs every admin out. |
| `SESSION_SECRET` | Yes | At least 32 characters: `openssl rand -base64 32`. |
| `SITE_URL` | Recommended | e.g. `https://cswitch.ng`. Used in referral links and emails. |
| `RESEND_API_KEY` | For email | From Resend. |
| `EMAIL_FROM` | For email | e.g. `CSwitch <hello@cswitch.ng>`, on the verified domain. |
| `EMAIL_REPLY_TO` | No | Where replies to the confirmation go. |

The server validates these when it starts. If a value is missing or malformed, every request
returns an error and the Vercel runtime logs list exactly which variables are wrong.

## 4. Rate limiting (Vercel Firewall)

The waitlist form and admin login are public endpoints. In **Firewall → Rules**, add:

- **Waitlist form:** rate limit `POST` requests to `/` (server actions post to the page)
  to around 10 per minute per IP.
- **Admin login:** rate limit `POST` requests to `/admin/login` to around 5 per minute per IP.

## 5. After deploying

1. Sign in at `/admin/login` and check `/admin/waitlist` loads.
2. Sign up with your own email and phone. Check that:
   - the row appears in the admin page as **Completed**, with **Email sent** under it;
   - the email arrives (check spam the first time) and its link opens the site.
3. If the admin page shows **Email failed**, hover it to see Resend's error. The usual cause
   is an unverified domain or an `EMAIL_FROM` on a different domain.

## Local development

```sh
cp .env.example .env.local   # then fill in the values
createdb cswitch_waitlist
npm run db:migrate
npm run dev
```

Without `RESEND_API_KEY`, no emails are sent locally.
