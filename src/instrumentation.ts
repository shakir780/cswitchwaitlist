export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Fail on boot, with every missing or malformed setting listed, instead of at the first signup.
    const { env } = await import("@/lib/env");
    env();
  }
}
