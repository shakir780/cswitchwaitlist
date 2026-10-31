import { Hero } from "@/components/hero/Hero";
import { Faq } from "@/components/sections/Faq";
import { Features } from "@/components/sections/Features";
import { FinalCta } from "@/components/sections/FinalCta";
import { Perks } from "@/components/sections/Perks";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import { SiteHeader } from "@/components/site/SiteHeader";
import { submitStepOne, submitWaitlist } from "./actions";

const WAITLIST_COUNT = 2340;

export default function Home() {
  return (
    <div className="relative isolate">
      <SiteHeader />
      <main>
        <Hero
          count={WAITLIST_COUNT}
          onStepOneSubmit={submitStepOne}
          onStepTwoSubmit={submitWaitlist}
        />
        <Features />
        <Perks />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
      <ScrollReveal />
    </div>
  );
}
