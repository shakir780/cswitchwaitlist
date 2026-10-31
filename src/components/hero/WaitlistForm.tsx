"use client";

import { useEffect, useRef, useState } from "react";
import {
  formatNigerianPhone,
  type WaitlistResult,
  type WaitlistStepOne,
  type WaitlistStepTwoInput,
  type WaitlistSubmission,
} from "@/lib/validation/waitlist";
import { StepOneForm } from "./StepOneForm";
import { StepTwoForm } from "./StepTwoForm";
import { WaitlistSuccess } from "./WaitlistSuccess";

export type { WaitlistResult, WaitlistStepOne, WaitlistSubmission };

export type WaitlistFormProps = {
  onStepOneSubmit: (data: WaitlistStepOne) => Promise<void>;
  onStepTwoSubmit: (data: WaitlistSubmission) => Promise<WaitlistResult>;
};

type Step = "about-you" | "business" | "done";
type Direction = "forward" | "back";

export function WaitlistForm({ onStepOneSubmit, onStepTwoSubmit }: WaitlistFormProps) {
  const [step, setStep] = useState<Step>("about-you");
  const [stepOne, setStepOne] = useState<WaitlistStepOne | null>(null);
  const [stepTwoDraft, setStepTwoDraft] = useState<WaitlistStepTwoInput>();
  const [result, setResult] = useState<WaitlistResult | null>(null);
  // null until the first step change, so the initial render doesn't animate twice.
  const [direction, setDirection] = useState<Direction | null>(null);
  const [height, setHeight] = useState<number>();

  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const focusHeading = useRef(false);

  // Track the content height so the card can animate between steps instead of jumping.
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const observer = new ResizeObserver(([entry]) => setHeight(entry.borderBoxSize[0].blockSize));
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  // After a step change, move focus to the new heading so keyboard and screen reader users follow along.
  useEffect(() => {
    if (!focusHeading.current) return;
    focusHeading.current = false;
    cardRef.current?.querySelector("h2")?.focus();
  }, [step]);

  function goTo(next: Step, nextDirection: Direction = "forward") {
    focusHeading.current = true;
    setDirection(nextDirection);
    setStep(next);
  }

  function backToHome() {
    setStepOne(null);
    setStepTwoDraft(undefined);
    setResult(null);
    setDirection(null);
    setStep("about-you");
    window.scrollTo({ top: 0 });
  }

  return (
    <div
      ref={cardRef}
      id="waitlist"
      style={{ height }}
      className="box-content scroll-mt-24 overflow-hidden rounded-[20px] bg-white shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-[height] duration-400 ease-(--ease-out-soft) motion-reduce:transition-none"
    >
      <div ref={contentRef} className="p-6 sm:p-8">
        <div key={step} className={direction ? stepAnimation[direction] : undefined}>
          {step === "about-you" && (
            <StepOneForm
              defaultValues={
                stepOne ? { ...stepOne, phone: formatNigerianPhone(stepOne.phone) } : undefined
              }
              onSubmit={async (data) => {
                await onStepOneSubmit(data);
                setStepOne(data);
                goTo("business");
              }}
            />
          )}

          {step === "business" && stepOne && (
            <StepTwoForm
              defaultValues={stepTwoDraft}
              onBack={(draft) => {
                setStepTwoDraft(draft);
                goTo("about-you", "back");
              }}
              onSubmit={async (data) => {
                setResult(await onStepTwoSubmit({ ...stepOne, ...data }));
                goTo("done");
              }}
            />
          )}

          {step === "done" && stepOne && result && (
            <WaitlistSuccess
              firstName={stepOne.fullName.split(/\s+/)[0]}
              email={stepOne.email}
              result={result}
              onBackToHome={backToHome}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const stepAnimation: Record<Direction, string> = {
  forward: "animate-step-forward",
  back: "animate-step-back",
};
