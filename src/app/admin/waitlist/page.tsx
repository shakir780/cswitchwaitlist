import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, LogOut } from "lucide-react";
import {
  filtersToQuery,
  listSignups,
  parseFilters,
  PAGE_SIZE,
  waitlistStats,
  type SignupRow,
  type WaitlistFilters,
} from "@/lib/admin/waitlist";
import { requireAdmin } from "@/lib/admin/session";
import {
  businessCategories,
  formatNigerianPhone,
  nigerianStates,
} from "@/lib/validation/waitlist";
import { logout } from "../actions";

export default function AdminWaitlistPage({ searchParams }: PageProps<"/admin/waitlist">) {
  return (
    <>
      <header className="border-b border-line-strong/60 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="CSwitch" width={108} height={56} className="h-9 w-auto" />
            <span className="rounded-full bg-sunken px-2.5 py-0.5 text-[12px] font-medium text-muted">
              Admin
            </span>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[14px] font-medium text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
            >
              <LogOut aria-hidden className="size-4" />
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6">
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-ink">Waitlist</h1>
        <Suspense fallback={<p className="mt-6 text-[15px] text-muted">Loading signups…</p>}>
          <WaitlistDashboard searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}

async function WaitlistDashboard({
  searchParams,
}: {
  searchParams: PageProps<"/admin/waitlist">["searchParams"];
}) {
  await requireAdmin();
  const filters = parseFilters(await searchParams);
  const [stats, { rows, total, pageCount }] = await Promise.all([
    waitlistStats(),
    listSignups(filters),
  ]);

  return (
    <>
      <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label="Total signups" value={stats.total} />
        <Stat label="Completed both steps" value={stats.complete} />
        <Stat label="Stopped after step 1" value={stats.incomplete} />
        <Stat label="Joined in last 24h" value={stats.last24h} />
        <Stat label="Came from a referral" value={stats.referred} />
      </dl>

      <Filters filters={filters} />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-muted">
          {total === 0
            ? "No signups match these filters."
            : `Showing ${(filters.page - 1) * PAGE_SIZE + 1}–${Math.min(filters.page * PAGE_SIZE, total)} of ${total.toLocaleString("en-US")}`}
        </p>
        <a
          href={`/admin/waitlist/export${filtersToQuery(filters, { page: 1 })}`}
          className="flex items-center gap-1.5 rounded-lg border border-line-strong bg-white px-3 py-2 text-[14px] font-medium text-ink hover:border-placeholder focus-visible:outline-2 focus-visible:outline-brand"
        >
          <Download aria-hidden className="size-4" />
          Export CSV
        </a>
      </div>

      {rows.length > 0 && <SignupsTable rows={rows} />}

      {pageCount > 1 && <Pagination filters={filters} pageCount={pageCount} />}
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white px-5 py-4">
      <dt className="text-[13px] text-muted">{label}</dt>
      <dd className="mt-1 text-[26px] font-semibold tracking-[-0.02em] text-ink tabular-nums">
        {value.toLocaleString("en-US")}
      </dd>
    </div>
  );
}

const fieldClass =
  "h-10 rounded-lg border border-line-strong bg-white px-3 text-[14px] text-ink focus:border-brand focus:outline-none focus:ring-[3px] focus:ring-brand/15";

function Filters({ filters }: { filters: WaitlistFilters }) {
  return (
    // Plain GET form: filters live in the URL, so views can be bookmarked and shared.
    <form method="get" className="mt-8 flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4">
      <label className="flex min-w-[220px] flex-1 flex-col gap-1 text-[13px] font-medium text-muted">
        Search
        <input
          type="search"
          name="q"
          defaultValue={filters.q}
          placeholder="Name, email, phone, business or code"
          className={fieldClass}
        />
      </label>
      <Select label="Status" name="status" value={filters.status}>
        <option value="all">All</option>
        <option value="complete">Completed</option>
        <option value="incomplete">Stopped after step 1</option>
      </Select>
      <Select label="State" name="state" value={filters.state ?? ""}>
        <option value="">All states</option>
        {nigerianStates.map((state) => (
          <option key={state}>{state}</option>
        ))}
      </Select>
      <Select label="Category" name="category" value={filters.category ?? ""}>
        <option value="">All categories</option>
        {businessCategories.map((category) => (
          <option key={category}>{category}</option>
        ))}
      </Select>
      <button
        type="submit"
        className="h-10 rounded-lg bg-brand px-4 text-[14px] font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        Apply
      </button>
      <Link
        href="/admin/waitlist"
        className="flex h-10 items-center rounded-lg px-3 text-[14px] font-medium text-muted hover:text-ink"
      >
        Clear
      </Link>
    </form>
  );
}

function Select({
  label,
  name,
  value,
  children,
}: {
  label: string;
  name: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-[13px] font-medium text-muted">
      {label}
      <select name={name} defaultValue={value} className={fieldClass}>
        {children}
      </select>
    </label>
  );
}

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Lagos",
});

function SignupsTable({ rows }: { rows: SignupRow[] }) {
  return (
    <div className="mt-3 overflow-x-auto rounded-2xl bg-white">
      <table className="w-full min-w-[1100px] text-left text-[14px]">
        <thead className="border-b border-line text-[12px] font-medium tracking-wide text-muted uppercase">
          <tr>
            {[
              "Joined",
              "Name",
              "Phone",
              "Business",
              "State",
              "Heard from",
              "Referral code",
              "Referrals",
            ].map((heading) => (
              <th key={heading} scope="col" className="px-4 py-3 font-medium whitespace-nowrap">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line align-top">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-canvas/50">
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-muted">{dateFormat.format(row.createdAt)}</div>
                <div className="mt-1.5">
                  {row.completedAt ? (
                    <span className="rounded-full bg-brand-tint px-2 py-0.5 text-[12px] font-medium text-[#2d7a34]">
                      Completed
                    </span>
                  ) : (
                    <span className="rounded-full bg-sunken px-2 py-0.5 text-[12px] font-medium text-muted">
                      Step 1 only
                    </span>
                  )}
                </div>
                {row.completedAt && <EmailStatus row={row} />}
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-ink">{row.fullName}</div>
                <a href={`mailto:${row.email}`} className="text-muted hover:text-ink hover:underline">
                  {row.email}
                </a>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <a href={`tel:${row.phone}`} className="text-ink hover:underline">
                  +234 {formatNigerianPhone(row.phone)}
                </a>
                {row.whatsappOptIn && (
                  <div className="text-[12px] text-[#2d7a34]">WhatsApp updates</div>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="text-ink">{row.businessName ?? <Empty />}</div>
                {row.category && <div className="text-muted">{row.category}</div>}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">{row.state ?? <Empty />}</td>
              <td className="px-4 py-3 whitespace-nowrap">{row.heardFrom ?? <Empty />}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <code className="text-[13px]">{row.referralCode}</code>
                {row.referredBy && (
                  <div className="text-[12px] text-muted">via {row.referredBy}</div>
                )}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">{row.referrals}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmailStatus({ row }: { row: SignupRow }) {
  if (row.emailSentAt) return <div className="mt-1.5 text-[12px] text-caption">Email sent</div>;
  if (row.emailError) {
    return (
      <div title={row.emailError} className="mt-1.5 cursor-help text-[12px] text-danger">
        Email failed
      </div>
    );
  }
  return null;
}

function Empty() {
  return <span className="text-placeholder">—</span>;
}

function Pagination({ filters, pageCount }: { filters: WaitlistFilters; pageCount: number }) {
  const link = (page: number, label: string) => (
    <Link
      href={`/admin/waitlist${filtersToQuery(filters, { page })}`}
      className="rounded-lg border border-line-strong bg-white px-3 py-1.5 text-[14px] font-medium text-ink hover:border-placeholder"
    >
      {label}
    </Link>
  );

  return (
    <nav aria-label="Pages" className="mt-4 flex items-center justify-end gap-3 text-[14px] text-muted">
      {filters.page > 1 && link(filters.page - 1, "Previous")}
      <span>
        Page {filters.page} of {pageCount}
      </span>
      {filters.page < pageCount && link(filters.page + 1, "Next")}
    </nav>
  );
}
