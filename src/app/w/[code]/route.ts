import { NextResponse, type NextRequest } from "next/server";
import {
  REFERRAL_CODE_PATTERN,
  REFERRAL_COOKIE,
  REFERRAL_COOKIE_MAX_AGE,
} from "@/lib/waitlist/referrals";

/** Referral links: remember who sent the visitor, then show them the landing page. */
export async function GET(request: NextRequest, { params }: RouteContext<"/w/[code]">) {
  const { code } = await params;
  const response = NextResponse.redirect(new URL("/", request.url));

  if (REFERRAL_CODE_PATTERN.test(code)) {
    response.cookies.set(REFERRAL_COOKIE, code, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: REFERRAL_COOKIE_MAX_AGE,
      path: "/",
    });
  }

  return response;
}
