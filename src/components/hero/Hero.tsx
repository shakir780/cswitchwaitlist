import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowLeftRight, CreditCard, QrCode } from "lucide-react";
import { HeroBackdrop } from "./HeroBackdrop";
import { WaitlistForm, type WaitlistFormProps } from "./WaitlistForm";

type HeroProps = WaitlistFormProps & {
  count?: number;
};

const paymentMethods: { label: string; icon: ReactNode }[] = [
  {
    label: "Visa",
    icon: (
      <span className="flex h-3 w-[18px] items-center justify-center rounded-[2px] border border-line-strong text-[6px] font-black tracking-tight text-[#1a1f71] italic">
        VISA
      </span>
    ),
  },
  {
    label: "Mastercard",
    icon: (
      <span className="flex">
        <span className="size-2.5 rounded-full bg-[#eb001b]" />
        <span className="-ml-1 size-2.5 rounded-full bg-[#f79e1b]/90" />
      </span>
    ),
  },
  {
    label: "Transfer",
    icon: <ArrowLeftRight className="size-3.5 text-brand" />,
  },
  { label: "QR", icon: <QrCode className="size-3.5 text-ink" /> },
  { label: "POS", icon: <CreditCard className="size-3.5 text-[#3b6fd8]" /> },
];
const avatarColors = ["bg-[#ebc77a]", "bg-[#a8d5ba]", "bg-[#e6a08f]"];

export function Hero({ onStepOneSubmit, onStepTwoSubmit, count = 2340 }: HeroProps) {
  return (
    <section aria-label="Join the CSwitch waitlist" className="relative">
      <HeroBackdrop />
      <div className="page-container grid gap-14 pt-14 pb-14 md:pb-22 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-start lg:gap-18">
        <div className="animate-rise lg:pt-6">
          <p className="inline-flex items-center rounded-full bg-brand-tint px-3 py-1.5 text-[12px] leading-5 font-semibold text-brand md:text-[14px]">
            Launching November 2026 · Early access
          </p>

          <h1 className="mt-6 max-w-[580px] text-[36px] leading-[1.1] font-bold text-ink md:text-[60px] md:leading-[1.08]">
            All your business payments, in one account.
          </h1>

          <p className="mt-6 max-w-[640px] text-[16px] leading-normal text-muted md:text-[20px]">
            Cards, payment links, transfers and POS, landing in one business account. Join the
            waitlist for early access and launch perks.
          </p>

          <ul aria-label="Supported payment methods" className="mt-6 flex flex-wrap gap-2">
            {paymentMethods.map(({ label, icon }) => (
              <li
                key={label}
                className="flex h-8 items-center gap-2 rounded-lg bg-white px-3 text-[15px] font-medium text-ink"
              >
                <span aria-hidden className="flex items-center">
                  {icon}
                </span>
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center gap-3">
            <div aria-hidden className="flex -space-x-1.5">
              {avatarColors.map((color) => (
                <span key={color} className={`size-6 rounded-full ring-2 ring-canvas ${color}`} />
              ))}
            </div>
            <p className="text-[16px] font-medium text-ink">
              {count.toLocaleString("en-US")} businesses already waiting
            </p>
          </div>

          <Image
            src="/hero-market-delivery.png"
            alt="A market trader hands a parcel to a dispatch rider as payment moves from her phone to his."
            width={1150}
            height={514}
            priority
            sizes="(min-width: 1024px) 440px, 100vw"
            className="mt-10 w-full max-w-[440px]"
          />
        </div>

        <div className="w-full max-w-[520px] animate-rise [animation-delay:80ms]">
          <WaitlistForm onStepOneSubmit={onStepOneSubmit} onStepTwoSubmit={onStepTwoSubmit} />
        </div>
      </div>
    </section>
  );
}
