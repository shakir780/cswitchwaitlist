import "server-only";
import { emailConfig } from "@/lib/env";
import type { Confirmation } from "./confirmations";

/** Sends through Resend's HTTP API. Swapping providers only means changing this function. */
export async function sendConfirmationEmail(to: string, confirmation: Confirmation) {
  const config = emailConfig();
  if (!config) throw new Error("Email is not configured");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      // Resend drops repeats with the same key, so a retried send can't email twice.
      "Idempotency-Key": `waitlist-confirmation/${to}`,
    },
    body: JSON.stringify({
      from: config.from,
      to: [to],
      reply_to: config.replyTo,
      subject: `You're #${confirmation.position.toLocaleString("en-US")} on the CSwitch waitlist`,
      html: confirmationHtml(confirmation),
      text: confirmationText(confirmation),
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Resend ${response.status}: ${(await response.text()).slice(0, 300)}`);
  }
}

function confirmationText({ firstName, position, referralUrl }: Confirmation) {
  return `Hi ${firstName},

You're #${position.toLocaleString("en-US")} on the CSwitch waitlist. Thanks for joining.

Move up the list for every business you refer. Each one that opens an account earns you ₦5,000. Share your link:
${referralUrl}

We'll contact you before launch to open your account.

CSwitch will never ask for your BVN, PIN or password.

The CSwitch team`;
}

function confirmationHtml({ firstName, position, referralUrl }: Confirmation) {
  const name = escapeHtml(firstName);
  const link = escapeHtml(referralUrl);
  const displayLink = escapeHtml(referralUrl.replace(/^https?:\/\//, ""));
  const font = "font-family:Inter,-apple-system,'Segoe UI',Roboto,Arial,sans-serif";

  // Table layout and inline styles: the only things email clients reliably render.
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f4f2ee">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2ee">
      <tr>
        <td align="center" style="padding:32px 16px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:20px">
            <tr>
              <td style="padding:32px;${font};color:#16181d">
                <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#0fbc49">CSwitch waitlist</p>
                <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;font-weight:700">You're on the list, ${name}!</h1>
                <p style="margin:0 0 4px;font-size:40px;line-height:1;font-weight:700;color:#0fbc49">#${position.toLocaleString("en-US")}</p>
                <p style="margin:0 0 24px;font-size:14px;color:#6b6e75">on the waitlist</p>
                <p style="margin:0 0 20px;font-size:16px;line-height:1.5;color:#5c5f66">Move up the list for every business you refer. Each one that opens an account earns you &#8358;5,000.</p>
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:10px;background:#0fbc49">
                      <a href="${link}" style="display:inline-block;padding:14px 24px;${font};font-size:16px;font-weight:600;color:#ffffff;text-decoration:none">Share your link</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:12px 0 24px;font-size:14px;color:#6b6e75;word-break:break-all">${displayLink}</p>
                <p style="margin:0 0 24px;font-size:16px;line-height:1.5;color:#5c5f66">We'll contact you before launch to open your account.</p>
                <p style="margin:0;padding-top:20px;border-top:1px solid #d3d0c8;font-size:13px;line-height:1.4;color:#6b6e75">CSwitch will never ask for your BVN, PIN or password. You're receiving this because you joined the CSwitch waitlist.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}
