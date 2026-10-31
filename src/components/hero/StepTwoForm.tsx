"use client";

import { useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import {
  branchCounts,
  businessCategories,
  businessNeeds,
  monthlySalesRanges,
  nigerianStates,
  referralSources,
  waitlistStepTwoSchema,
  type WaitlistStepTwo,
  type WaitlistStepTwoInput,
} from "@/lib/validation/waitlist";
import {
  Checkbox,
  Field,
  FieldError,
  FormError,
  Select,
  StepHeading,
  StepProgress,
  SubmitButton,
  TextButton,
  chipClass,
  inputClass,
} from "./fields";
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
  monthlySales: "",
  needs: [],
  branches: "",
  heardFrom: "",
  consent: false,
};

export function StepTwoForm({ defaultValues, onSubmit, onBack }: StepTwoFormProps) {
  const needsErrorId = useId();
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
          <Field label="Monthly sales" error={errors.monthlySales?.message}>
            {(a11y) => (
              <Select {...a11y} {...register("monthlySales")} placeholder="Select a range">
                {monthlySalesRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>

        <fieldset aria-describedby={errors.needs ? needsErrorId : undefined}>
          <legend className="mb-1.5 text-[14px] font-medium text-ink">
            What do you need?<span aria-hidden className="text-ink"> *</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {businessNeeds.map((need) => (
              <label
                key={need}
                className={`group cursor-pointer select-none ${chipClass} has-checked:border-brand-dark has-checked:bg-brand-tint-soft has-checked:text-brand-dark has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-dark`}
              >
                <input {...register("needs")} type="checkbox" value={need} className="sr-only" />
                <Check aria-hidden strokeWidth={2.5} className="hidden size-3.5 group-has-checked:block" />
                {need}
              </label>
            ))}
          </div>
          <FieldError id={needsErrorId} message={errors.needs?.message} />
        </fieldset>

        <div className="grid gap-[18px] sm:grid-cols-2 sm:gap-3">
          <Field label="Branches" optional error={errors.branches?.message}>
            {(a11y) => (
              <Select {...a11y} {...register("branches")} placeholder="Select">
                {branchCounts.map((count) => (
                  <option key={count}>{count}</option>
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
            <>
              I agree to the <PrivacyLink /> and to CSwitch contacting me about early access.
              <span aria-hidden className="text-muted"> *</span>
            </>
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
