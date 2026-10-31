import { ChevronDown } from "lucide-react";

const faqs: { question: string; answer: string }[] = [
  {
    question: "Who can join the waitlist?",
    answer:
      "Any business in Nigeria can join. To open your account at launch, you’ll need to be a registered company, a business name or a sole trader.",
  },
  {
    question: "When does CSwitch launch?",
    answer:
      "We’re launching in November 2026. Waitlist members get access first, in the order they joined.",
  },
  {
    question: "What will it cost?",
    answer:
      "Early merchants pay no fees for the first 60–90 days. After that, Sharp Rewards gives you 5–20% of your fees back as airtime or cash.",
  },
  {
    question: "What do I need to open an account?",
    answer:
      "Your business registration details as a registered company, business name or sole trader. We’ll tell you exactly what to upload when your account opens. No documents are needed to join the waitlist.",
  },
  {
    question: "How can my customers pay me?",
    answer:
      "By Visa or Mastercard, bank transfer, payment link, QR code or POS. Every payment lands in the same business account.",
  },
  {
    question: "How fast do I get my money?",
    answer: "We’ll share settlement times for each payment method before launch.",
  },
  {
    question: "How does the referral bonus work?",
    answer:
      "After you join, you get a referral link. You move up the list for every business you refer, and each one that opens an account earns you ₦5,000.",
  },
  {
    question: "Is my information safe?",
    answer:
      "We only ask for what we need to reach you about early access. We never ask for your BVN or password at this stage.",
  },
];

export function Faq() {
  return (
    <section aria-labelledby="faq-title">
      <div className="page-container py-14 md:py-22">
        <div data-reveal>
          <h2
            id="faq-title"
            className="text-[28px] leading-tight font-bold text-ink md:text-[40px] md:leading-[1.15]"
          >
            Questions, answered.
          </h2>
          <p className="mt-2 text-[13px] text-caption md:text-[14px] md:leading-[1.4]">Tap a question to see the answer.</p>
        </div>

        <div data-reveal className="mt-10 max-w-[1020px] space-y-3">
          {faqs.map(({ question, answer }, i) => (
            <details
              key={question}
              name="faq"
              open={i === 0}
              className="group rounded-xl border border-transparent bg-white transition-colors duration-150 ease-out open:border-brand-dark"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-6 py-5 text-[16px] font-medium text-ink md:text-[18px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark [&::-webkit-details-marker]:hidden">
                {question}
                <ChevronDown
                  aria-hidden
                  className="size-5 shrink-0 transition-transform duration-200 ease-out group-open:rotate-180"
                />
              </summary>
              <p className="-mt-2 px-6 pb-5 text-[15px] leading-normal text-muted md:text-[16px]">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
