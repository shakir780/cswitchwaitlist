"use client";

export function JoinButton() {
  function handleClick() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document
      .getElementById("waitlist")
      ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    document
      .querySelector<HTMLElement>("#waitlist :is(input, select, button)")
      ?.focus({ preventScroll: true });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="h-[49px] shrink-0 rounded-[10px] bg-brand px-6 text-[16px] font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-brand-hover motion-safe:active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark"
    >
      Join the waitlist
    </button>
  );
}
