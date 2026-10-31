"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  waitlistStepOneSchema,
  type WaitlistStepOne,
  type WaitlistStepOneInput,
} from "@/lib/validation/waitlist";
import {
  Checkbox,
  Field,
  FormError,
  StepHeading,
  StepProgress,
  SubmitButton,
  inputClass,
} from "./fields";

type StepOneFormProps = {
  defaultValues?: WaitlistStepOneInput;
  onSubmit: (data: WaitlistStepOne) => Promise<void>;
};

export function StepOneForm({ defaultValues, onSubmit }: StepOneFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<WaitlistStepOneInput, unknown, WaitlistStepOne>({
    resolver: zodResolver(waitlistStepOneSchema),
    mode: "onTouched",
    defaultValues: defaultValues ?? { fullName: "", email: "", phone: "", whatsappOptIn: true },
  });

  const submit = handleSubmit(async (data) => {
    try {
      await onSubmit(data);
    } catch {
      setError("root", { message: "Something went wrong. Please try again." });
    }
  });

  return (
    <>
      <StepProgress step={1} label="About you" />
      <StepHeading title="Join the waitlist" helper="Takes under a minute. No documents needed yet." />

      <form onSubmit={submit} noValidate className="mt-6 space-y-[18px]">
        <Field label="Full name" error={errors.fullName?.message}>
          {(a11y) => (
            <input
              {...a11y}
              {...register("fullName")}
              type="text"
              autoComplete="name"
              placeholder="Adaeze Okonkwo"
              className={inputClass}
            />
          )}
        </Field>

        <Field label="Email address" error={errors.email?.message}>
          {(a11y) => (
            <input
              {...a11y}
              {...register("email")}
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@business.com"
              className={inputClass}
            />
          )}
        </Field>

        <Field label="Phone number" error={errors.phone?.message}>
          {(a11y) => (
            <div className="relative">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[16px] text-placeholder"
              >
                +234
              </span>
              <input
                {...a11y}
                {...register("phone")}
                type="tel"
                autoComplete="tel-national"
                inputMode="tel"
                placeholder="803 123 4567"
                className={`${inputClass} pl-[4.5rem]`}
              />
            </div>
          )}
        </Field>

        <Checkbox {...register("whatsappOptIn")} label="Send me updates on WhatsApp" />

        <FormError message={errors.root?.message} />

        <SubmitButton pending={isSubmitting}>Continue</SubmitButton>

        <p className="text-[13px] text-caption md:text-[14px] md:leading-[1.4]">
          By continuing you agree to our <PrivacyLink />. We never ask for your BVN or password at
          this stage.
        </p>
      </form>
    </>
  );
}

export function PrivacyLink() {
  return (
    <Link
      href="/privacy"
      className="underline-offset-2 hover:text-ink hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark"
    >
      Privacy Policy
    </Link>
  );
}
