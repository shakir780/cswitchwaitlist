import type { NextRequest } from "next/server";
import { allSignups, parseFilters } from "@/lib/admin/waitlist";
import { hasAdminSession } from "@/lib/admin/session";
import { monthlySalesRanges } from "@/lib/validation/waitlist";

const salesLabels = new Map<string, string>(monthlySalesRanges.map((r) => [r.value, r.label]));

export async function GET(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return new Response("Not signed in", { status: 401 });
  }

  const filters = parseFilters(Object.fromEntries(request.nextUrl.searchParams));
  const rows = await allSignups(filters);

  const header = [
    "Joined",
    "Completed",
    "Full name",
    "Email",
    "Phone",
    "WhatsApp updates",
    "Business name",
    "Category",
    "State",
    "Monthly sales",
    "Needs",
    "Branches",
    "Heard from",
    "Referral code",
    "Referred by",
    "Referrals",
    "Email sent",
    "Email error",
  ];
  const lines = rows.map((row) => [
    row.createdAt.toISOString(),
    row.completedAt?.toISOString() ?? "",
    row.fullName,
    row.email,
    row.phone,
    row.whatsappOptIn ? "Yes" : "No",
    row.businessName ?? "",
    row.category ?? "",
    row.state ?? "",
    row.monthlySales ? (salesLabels.get(row.monthlySales) ?? row.monthlySales) : "",
    row.needs?.join("; ") ?? "",
    row.branches ?? "",
    row.heardFrom ?? "",
    row.referralCode,
    row.referredBy ?? "",
    String(row.referrals),
    row.emailSentAt?.toISOString() ?? "",
    row.emailError ?? "",
  ]);

  // BOM so Excel opens the ₦ signs correctly.
  const csv = "﻿" + [header, ...lines].map((cells) => cells.map(csvCell).join(",")).join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="cswitch-waitlist-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

function csvCell(value: string) {
  // Values typed by the public must not run as spreadsheet formulas. Plain numbers like +234… are fine.
  const safe = /^[=@\t\r]|^[+-](?!\d+$)/.test(value) ? `'${value}` : value;
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}
