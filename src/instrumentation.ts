export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Log setting problems loudly on boot. Not fatal: signups only need DATABASE_URL, and
    // admin code re-checks everything it needs. /api/health shows the same list.
    const { envProblems } = await import("@/lib/env");
    const problems = envProblems();
    if (problems.length > 0) {
      console.error(`Invalid environment variables:\n${problems.map((p) => `  - ${p}`).join("\n")}`);
    }
  }
}
