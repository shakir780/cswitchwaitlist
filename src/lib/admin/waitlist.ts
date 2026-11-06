import "server-only";
import { and, count, desc, eq, ilike, isNotNull, isNull, or, sql, type SQL } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { businessCategories, nigerianStates } from "@/lib/validation/waitlist";

const { waitlistSignups: signups } = schema;

export const PAGE_SIZE = 50;

export const statusOptions = ["all", "complete", "incomplete"] as const;

export type WaitlistFilters = {
  q: string;
  status: (typeof statusOptions)[number];
  state?: (typeof nigerianStates)[number];
  category?: (typeof businessCategories)[number];
  page: number;
};

type SearchParams = Record<string, string | string[] | undefined>;

/** Reads filters from the URL, dropping anything that isn't a known value. */
export function parseFilters(params: SearchParams): WaitlistFilters {
  const get = (key: string) => {
    const value = params[key];
    return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
  };
  const pick = <T extends readonly string[]>(options: T, value: string) =>
    options.find((option) => option === value) as T[number] | undefined;

  return {
    q: get("q").slice(0, 100),
    status: pick(statusOptions, get("status")) ?? "all",
    state: pick(nigerianStates, get("state")),
    category: pick(businessCategories, get("category")),
    page: Math.max(1, Math.floor(Number(get("page"))) || 1),
  };
}

/** The filters as a query string, for links that keep the current view. */
export function filtersToQuery(filters: WaitlistFilters, overrides: Partial<WaitlistFilters> = {}) {
  const merged = { ...filters, ...overrides };
  const query = new URLSearchParams();
  if (merged.q) query.set("q", merged.q);
  if (merged.status !== "all") query.set("status", merged.status);
  if (merged.state) query.set("state", merged.state);
  if (merged.category) query.set("category", merged.category);
  if (merged.page > 1) query.set("page", String(merged.page));
  const string = query.toString();
  return string ? `?${string}` : "";
}

function whereFor(filters: WaitlistFilters): SQL | undefined {
  const conditions: (SQL | undefined)[] = [];

  if (filters.q) {
    const pattern = `%${filters.q.replace(/[\\%_]/g, "\\$&")}%`;
    // Phones are stored as +234…, so "0803 123" should still match.
    const digits = filters.q.replace(/\D/g, "").replace(/^(234|0)/, "");
    conditions.push(
      or(
        ilike(signups.fullName, pattern),
        ilike(signups.email, pattern),
        ilike(signups.businessName, pattern),
        ilike(signups.referralCode, pattern),
        digits.length >= 3 ? ilike(signups.phone, `%${digits}%`) : undefined,
      ),
    );
  }
  if (filters.status === "complete") conditions.push(isNotNull(signups.completedAt));
  if (filters.status === "incomplete") conditions.push(isNull(signups.completedAt));
  if (filters.state) conditions.push(eq(signups.state, filters.state));
  if (filters.category) conditions.push(eq(signups.category, filters.category));

  return and(...conditions);
}

function selectSignups(filters: WaitlistFilters) {
  const referralCounts = getDb()
    .select({ code: signups.referredBy, referrals: count().as("referrals") })
    .from(signups)
    .groupBy(signups.referredBy)
    .as("referral_counts");

  return getDb()
    .select({
      id: signups.id,
      fullName: signups.fullName,
      email: signups.email,
      phone: signups.phone,
      whatsappOptIn: signups.whatsappOptIn,
      businessName: signups.businessName,
      category: signups.category,
      state: signups.state,
      heardFrom: signups.heardFrom,
      referralCode: signups.referralCode,
      referredBy: signups.referredBy,
      referrals: sql<number>`coalesce(${referralCounts.referrals}, 0)::int`,
      createdAt: signups.createdAt,
      completedAt: signups.completedAt,
      emailSentAt: signups.emailSentAt,
      emailError: signups.emailError,
    })
    .from(signups)
    .leftJoin(referralCounts, eq(referralCounts.code, signups.referralCode))
    .where(whereFor(filters))
    .orderBy(desc(signups.createdAt));
}

export type SignupRow = Awaited<ReturnType<typeof selectSignups>>[number];

export async function listSignups(filters: WaitlistFilters) {
  const [rows, [{ total }]] = await Promise.all([
    selectSignups(filters)
      .limit(PAGE_SIZE)
      .offset((filters.page - 1) * PAGE_SIZE),
    getDb().select({ total: count() }).from(signups).where(whereFor(filters)),
  ]);
  return { rows, total, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

/** Every matching signup, unpaginated, for CSV export. */
export function allSignups(filters: WaitlistFilters) {
  return selectSignups(filters);
}

export async function waitlistStats() {
  const [stats] = await getDb()
    .select({
      total: count(),
      complete: count(signups.completedAt),
      last24h: sql<number>`count(*) filter (where ${signups.createdAt} > now() - interval '24 hours')::int`,
      referred: count(signups.referredBy),
    })
    .from(signups);
  return { ...stats, incomplete: stats.total - stats.complete };
}
