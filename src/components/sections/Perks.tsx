import { Percent, Tag, User, type LucideIcon } from "lucide-react";

const perks: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Tag,
    title: "No fees to start",
    description: "Early merchants pay no fees for the first 60–90 days.",
  },
  {
    icon: Percent,
    title: "Sharp Rewards",
    description: "5–20% of your fees back as airtime or cash.",
  },
  {
    icon: User,
    title: "A named person",
    description: "Real support that fixes problems within hours.",
  },
];

export function Perks() {
  return (
    <section
      aria-labelledby="perks-title"
      className="dot-grid-on-dark bg-night"
    >
      <div className="page-container py-14 md:py-22">
        <h2
          id="perks-title"
          data-reveal
          className="text-[28px] leading-tight font-bold text-white md:text-[40px] md:leading-[1.15]"
        >
          Join early. Money go enter sharp!
        </h2>

        <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {perks.map(({ icon: Icon, title, description }, i) => (
            <li
              key={title}
              data-reveal
              style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}
              className="flex flex-col gap-2.5 rounded-2xl bg-night-raised p-7"
            >
              <div className="flex items-center justify-between">
                <span
                  aria-hidden
                  className="flex size-9 items-center justify-center rounded-[10px] bg-brand-on-dark/14 text-brand-on-dark"
                >
                  <Icon className="size-[18px]" strokeWidth={1.75} />
                </span>
                <span aria-hidden className="text-[14px] font-semibold text-brand-on-dark">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-[18px] font-semibold text-white md:text-[20px]">{title}</h3>
              <p className="text-[15px] leading-normal text-on-night-muted md:text-[16px]">{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
