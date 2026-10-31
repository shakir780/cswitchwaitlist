"use server";

import { redirect } from "next/navigation";
import { clearAdminSession, createAdminSession, isCorrectPassword } from "@/lib/admin/session";

export type LoginState = { error?: string };

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const password = formData.get("password");
  if (typeof password !== "string" || !isCorrectPassword(password)) {
    // Slows down password guessing a little; real rate limiting belongs at the edge.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { error: "That password isn’t right." };
  }

  await createAdminSession();
  redirect("/admin/waitlist");
}

export async function logout() {
  await clearAdminSession();
  redirect("/admin/login");
}
