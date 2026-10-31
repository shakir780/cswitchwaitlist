import { JoinButton } from "@/components/hero/JoinButton";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="bg-brand-tint">
      <div
        data-reveal
        className="page-container flex flex-col items-center py-14 text-center md:py-22"
      >
        <h2
          id="cta-title"
          className="text-[28px] leading-tight font-bold text-ink md:text-[40px] md:leading-[1.15] text-balance"
        >
          Ready when you are.
        </h2>
        <p className="mt-4 text-[16px] leading-normal text-muted md:text-[20px]">Get early access before we launch.</p>
        <div className="mt-8">
          <JoinButton />
        </div>
      </div>
    </section>
  );
}
