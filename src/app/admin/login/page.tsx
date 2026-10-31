import Image from "next/image";
import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-[380px] rounded-3xl bg-white p-8 shadow-[0_1px_2px_rgba(20,20,20,0.04),0_12px_32px_rgba(20,20,20,0.06)]">
        <Image src="/logo.png" alt="CSwitch" width={108} height={56} priority />
        <h1 className="mt-6 text-2xl font-semibold tracking-[-0.02em] text-ink">Admin sign in</h1>
        <p className="mt-1.5 text-[15px] text-muted">Enter the admin password to see the waitlist.</p>
        <LoginForm />
      </div>
    </main>
  );
}
