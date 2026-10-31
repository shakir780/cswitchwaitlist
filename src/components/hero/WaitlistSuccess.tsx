"use client";

import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import type { WaitlistResult } from "@/lib/validation/waitlist";
import { StepHeading, chipClass, focusRing } from "./fields";

type WaitlistSuccessProps = {
  firstName: string;
  email: string;
  result: WaitlistResult;
  onBackToHome: () => void;
};

const shareChipClass = `${chipClass} ${focusRing}`;

export function WaitlistSuccess({
  firstName,
  email,
  result,
  onBackToHome,
}: WaitlistSuccessProps) {
  const [copied, setCopied] = useState(false);
  const displayUrl = result.referralUrl.replace(/^https?:\/\//, "");
  const shareText = `I just joined the CSwitch waitlist: all your business payments in one account. Join with my link: ${result.referralUrl}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(result.referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the link stays visible and selectable.
    }
  }

  async function shareNative() {
    if (navigator.share) {
      await navigator.share({ text: shareText, url: result.referralUrl }).catch(() => {});
    } else {
      await copyLink();
    }
  }

  const shareLinks = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(shareText)}` },
    { label: "X", href: `https://x.com/intent/post?text=${encodeURIComponent(shareText)}` },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(result.referralUrl)}`,
    },
  ];

  return (
    <>
      <span className="flex size-10 animate-pop items-center justify-center rounded-full bg-brand-tint text-brand [animation-delay:150ms]">
        <Check aria-hidden strokeWidth={2.5} className="size-5" />
      </span>

      <StepHeading title={`You're on the list, ${firstName}!`} />

      <p className="mt-3 flex items-baseline gap-2">
        <span className="text-[40px] leading-none font-bold text-brand">
          #{result.position.toLocaleString("en-US")}
        </span>
        <span className="text-[14px] text-caption">on the waitlist</span>
      </p>

      <p className="mt-5 text-[15px] leading-normal text-muted md:text-[16px]">
        Move up the list for every business you refer. Each one that opens an account earns you
        ₦5,000.
      </p>

      <div className="mt-5 flex h-[49px] items-center gap-2 rounded-lg border border-line-strong bg-canvas pr-1.5 pl-4">
        <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-ink select-all">
          {displayUrl}
        </span>
        <button
          type="button"
          onClick={copyLink}
          className={`h-9 shrink-0 rounded-lg bg-ink px-3.5 text-[14px] font-semibold text-white transition-colors duration-150 hover:bg-ink/85 ${focusRing}`}
        >
          {copied ? "Copied" : "Copy"}
        </button>
        <span aria-live="polite" className="sr-only">
          {copied ? "Referral link copied" : ""}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {shareLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={shareChipClass}
          >
            {link.label}
          </a>
        ))}
        <button type="button" onClick={shareNative} className={shareChipClass}>
          Instagram
        </button>
      </div>

      <p className="mt-7 border-t border-line-strong pt-5 text-[13px] text-caption md:text-[14px] md:leading-[1.4]">
        {result.confirmationEmail ? "We\u2019re sending a confirmation to " : "We\u2019ll reach you at "}
        <span className="font-medium text-ink">{email}</span>. We&rsquo;ll contact you before launch
        to open your account.
      </p>

      <button
        type="button"
        onClick={onBackToHome}
        className={`mt-5 inline-flex items-center gap-1.5 rounded-md text-[16px] font-semibold text-ink transition-colors duration-150 hover:text-brand-dark ${focusRing}`}
      >
        <ArrowLeft aria-hidden className="size-4" />
        Back to home
      </button>
    </>
  );
}

