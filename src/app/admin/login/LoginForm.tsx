"use client";

import { useActionState } from "react";
import { inputClass, SubmitButton } from "@/components/hero/fields";
import { login, type LoginState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="password" className="block text-[14px] font-medium text-ink">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "password-error" : undefined}
          className={`${inputClass} mt-1.5`}
        />
        {state.error && (
          <p id="password-error" role="alert" className="mt-1.5 text-[13px] text-danger">
            {state.error}
          </p>
        )}
      </div>
      <SubmitButton pending={pending}>Sign in</SubmitButton>
    </form>
  );
}
