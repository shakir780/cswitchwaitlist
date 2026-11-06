import Link from "next/link";
import { COMPANY_NAME } from "@/lib/company";

const footerLinks = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line-strong bg-surface">
      <div className="page-container flex flex-col gap-5 py-8 text-[13px] text-caption md:flex-row md:text-[14px] md:items-center md:justify-between">
        <p>© 2026 {COMPANY_NAME}. CSwitch is a product of {COMPANY_NAME}.</p>
        <nav aria-label="Legal">
          <ul className="flex items-center gap-2.5">
            {footerLinks.map((link, index) => (
              <li key={link.href} className="flex items-center gap-2.5">
                {index > 0 && <span aria-hidden>·</span>}
                <Link
                  href={link.href}
                  className="rounded-sm font-medium text-ink/75 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
