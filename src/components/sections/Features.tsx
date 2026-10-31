import { ChartColumn, FileText, Landmark, Layers, ShieldCheck, Users, type LucideIcon } from "lucide-react";

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Landmark,
    title: "Virtual accounts",
    description: "An account number for every customer, so payments match themselves.",
  },
  {
    icon: Users,
    title: "Bulk payouts",
    description: "Pay hundreds of people from one upload, with approvals first.",
  },
  {
    icon: FileText,
    title: "Invoices",
    description: "Branded invoices with a pay button and polite reminders.",
  },
  {
    icon: Layers,
    title: "Subaccounts and money pots",
    description: "Separate pots for payroll, tax and each branch.",
  },
  {
    icon: ChartColumn,
    title: "Statements",
    description: "Any period, as PDF or CSV, ready for your accountant.",
  },
  {
    icon: ShieldCheck,
    title: "Team and approvals",
    description: "Roles for every staff member, and a second sign-off on big transfers.",
  },
];

export function Features() {
  return (
    <section aria-labelledby="features-title" className="dot-grid bg-surface">
      <div className="page-container py-14 md:py-22">
        <h2
          id="features-title"
          data-reveal
          className="text-[28px] leading-tight font-bold text-ink md:text-[40px] md:leading-[1.15]"
        >
          Everything a business account should do. And more.
        </h2>

        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }, i) => (
            <li
              key={title}
              data-reveal
              style={{ "--reveal-delay": `${(i % 3) * 60}ms` } as React.CSSProperties}
              className="flex flex-col gap-2.5 rounded-2xl bg-white p-7"
            >
              <span
                aria-hidden
                className="flex size-9 items-center justify-center rounded-[10px] bg-brand-tint text-brand"
              >
                <Icon className="size-[18px]" strokeWidth={1.75} />
              </span>
              <h3 className="text-[18px] font-semibold text-ink md:text-[20px]">{title}</h3>
              <p className="text-[15px] leading-normal text-muted md:text-[16px]">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
