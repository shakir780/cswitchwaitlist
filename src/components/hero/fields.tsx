"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { ArrowLeft, Check, ChevronDown, Loader2 } from "lucide-react";

/** 49px field, 16px side padding, 8px radius; focus is a 2px green-800 ring (border + 1px ring). */
export const inputClass =
  "h-[49px] w-full rounded-lg border border-placeholder bg-white px-4 text-[16px] text-ink placeholder:text-placeholder transition-[border-color,box-shadow] duration-150 ease-out focus:border-brand-dark focus:ring-1 focus:ring-brand-dark focus:outline-none aria-invalid:border-danger aria-invalid:focus:ring-danger";

export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark";

/** Pill chip: 37px tall, stone-300 border; selected is mint-50 with a green-800 border. */
export const chipClass =
  "inline-flex h-[37px] items-center gap-1.5 rounded-full border border-line-strong bg-white px-3.5 text-[14px] font-medium text-ink transition-colors duration-150 ease-out hover:border-placeholder";

type FieldA11y = {
  id: string;
  required: boolean;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
};

type FieldProps = {
  label: string;
  error?: string;
  optional?: boolean;
  children: (a11y: FieldA11y) => ReactNode;
};

export function Field({ label, error, optional, children }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[14px] font-medium text-ink">
        {label}
        {optional ? (
          <span className="font-normal text-caption"> (optional)</span>
        ) : (
          <span aria-hidden className="text-ink"> *</span>
        )}
      </label>
      {children({
        id,
        required: !optional,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
      })}
      <FieldError id={errorId} message={error} />
    </div>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-[13px] text-danger">
      {message}
    </p>
  );
}

type SelectProps = ComponentProps<"select"> & { placeholder: string };

export function Select({ placeholder, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`${inputClass} appearance-none pr-11 has-[option[value='']:checked]:text-placeholder [&_option]:text-ink`}
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-muted"
      />
    </div>
  );
}

type CheckboxProps = ComponentProps<"input"> & { label: ReactNode; error?: string };

export function Checkbox({ label, error, ...props }: CheckboxProps) {
  const errorId = useId();

  return (
    <div>
      <label className="flex cursor-pointer items-start gap-2.5 text-[15px] leading-5 text-ink md:text-[16px]">
        <span className="relative mt-px flex size-5 shrink-0">
          <input
            {...props}
            type="checkbox"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className="peer size-5 cursor-pointer appearance-none rounded-[5px] border border-placeholder bg-white transition-colors duration-150 checked:border-brand checked:bg-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark aria-invalid:border-danger"
          />
          <Check
            aria-hidden
            strokeWidth={3}
            className="pointer-events-none absolute inset-0.5 size-4 text-white opacity-0 peer-checked:opacity-100"
          />
        </span>
        <span>{label}</span>
      </label>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

export function StepProgress({ step, label }: { step: 1 | 2; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        role="progressbar"
        aria-label={`Step ${step} of 2`}
        aria-valuemin={1}
        aria-valuemax={2}
        aria-valuenow={step}
        className="flex gap-1.5"
      >
        <span className="h-1 w-12 rounded-full bg-brand" />
        <span className={`h-1 w-12 rounded-full ${step === 2 ? "bg-brand" : "bg-line-strong"}`} />
      </div>
      <p className="text-[13px] text-caption md:text-[14px] md:leading-[1.4]">
        Step {step} of 2 · {label}
      </p>
    </div>
  );
}

export function StepHeading({ title, helper }: { title: string; helper?: string }) {
  return (
    <>
      <h2
        tabIndex={-1}
        className="mt-5 text-[24px] leading-tight font-bold text-ink focus:outline-none md:text-[28px]"
      >
        {title}
      </h2>
      {helper && <p className="mt-2 text-[15px] leading-normal text-muted md:text-[16px]">{helper}</p>}
    </>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-[13px] text-danger">
      {message}
    </p>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={`flex h-[49px] w-full items-center justify-center gap-2 rounded-[10px] bg-brand px-6 text-[16px] font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-brand-hover motion-safe:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-80 ${focusRing}`}
    >
      {pending && <Loader2 aria-hidden className="size-4 animate-spin" />}
      {pending ? "Submitting…" : children}
    </button>
  );
}

/** "← Back": 49px tall, no fill, ink text. */
export function TextButton(props: ComponentProps<"button">) {
  return (
    <button
      type="button"
      {...props}
      className={`flex h-[49px] shrink-0 items-center gap-1.5 rounded-[10px] px-2 text-[16px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-ink/5 disabled:opacity-60 ${focusRing}`}
    >
      <ArrowLeft aria-hidden className="size-4" />
      {props.children}
    </button>
  );
}
