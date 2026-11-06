"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  businessCategories,
  nigerianStates,
  referralSources,
  waitlistStepTwoSchema,
  type WaitlistStepTwo,
  type WaitlistStepTwoInput,
} from "@/lib/validation/waitlist";
import {
  Checkbox,
  Field,
  FormError,
  Select,
  StepHeading,
  StepProgress,
  SubmitButton,
  TextButton,
  inputClass,
} from "./fields";
import { COMPANY_NAME, PRIVACY_CONTACT_EMAIL } from "@/lib/company";
import { PrivacyLink } from "./StepOneForm";

type StepTwoFormProps = {
  defaultValues?: WaitlistStepTwoInput;
  onSubmit: (data: WaitlistStepTwo) => Promise<void>;
  onBack: (draft: WaitlistStepTwoInput) => void;
};

const emptyValues: WaitlistStepTwoInput = {
  businessName: "",
  category: "",
  state: "",
  heardFrom: "",
  consent: false,
};

export function StepTwoForm({ defaultValues, onSubmit, onBack }: StepTwoFormProps) {
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<WaitlistStepTwoInput, unknown, WaitlistStepTwo>({
    resolver: zodResolver(waitlistStepTwoSchema),
    mode: "onTouched",
    defaultValues: defaultValues ?? emptyValues,
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
      <StepProgress step={2} label="About your business" />
      <StepHeading title="Tell us about your business" />

      <form onSubmit={submit} noValidate className="mt-6 space-y-[18px]">
        <Field label="Business name" error={errors.businessName?.message}>
          {(a11y) => (
            <input
              {...a11y}
              {...register("businessName")}
              type="text"
              autoComplete="organization"
              placeholder="Mama T's Kitchen"
              className={inputClass}
            />
          )}
        </Field>

        <Field label="Business category" error={errors.category?.message}>
          {(a11y) => (
            <Select {...a11y} {...register("category")} placeholder="Select a category">
              {businessCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </Select>
          )}
        </Field>

        <div className="grid gap-[18px] sm:grid-cols-2 sm:gap-3">
          <Field label="State" error={errors.state?.message}>
            {(a11y) => (
              <Select {...a11y} {...register("state")} placeholder="Select a state">
                {nigerianStates.map((state) => (
                  <option key={state}>{state}</option>
                ))}
              </Select>
            )}
          </Field>
          <Field label="How did you hear?" optional error={errors.heardFrom?.message}>
            {(a11y) => (
              <Select {...a11y} {...register("heardFrom")} placeholder="Select">
                {referralSources.map((source) => (
                  <option key={source}>{source}</option>
                ))}
              </Select>
            )}
          </Field>
        </div>

        <Checkbox
          {...register("consent")}
          error={errors.consent?.message}
          label={
            <span className="block text-[13px] leading-[1.4] text-muted md:text-[14px]">
              By submitting this form, I consent to {COMPANY_NAME} collecting and using my
              information to contact me about its products and services. My information will be
              handled in accordance with the Nigeria Data Protection Act and {COMPANY_NAME}&rsquo;s{" "}
              <PrivacyLink>privacy notice</PrivacyLink>. I may withdraw my consent at any time by
              contacting{" "}
              <a
                href={`mailto:${PRIVACY_CONTACT_EMAIL}`}
                className="underline-offset-2 hover:text-ink hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark"
              >
                {PRIVACY_CONTACT_EMAIL}
              </a>
              .<span aria-hidden className="text-ink"> *</span>
            </span>
          }
        />

        <FormError message={errors.root?.message} />

        <div className="flex items-center gap-3">
          <TextButton onClick={() => onBack(getValues())} disabled={isSubmitting}>
            Back
          </TextButton>
          <SubmitButton pending={isSubmitting}>Join the waitlist</SubmitButton>
        </div>
      </form>
    </>
  );
}
