const glow = "absolute rounded-full blur-[90px] md:blur-[200px]";

/**
 * The hero background from the brand guidelines: a faint grid fading out from the top
 * centre, blurred glows, and a fade to cream over the last 22% of the hero. It extends
 * up behind the header, which is transparent at the top of the page.
 */
export function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 -top-[84px] bottom-0 -z-10 overflow-hidden"
    >
      {/* mint-400 at ~30%, top left and top centre */}
      <div
        className={`${glow} -top-32 -left-32 size-[260px] md:-top-40 md:-left-40 md:size-[480px] bg-brand-on-dark/30`}
      />
      <div
        className={`${glow} -top-40 left-1/2 size-[280px] -translate-x-1/2 md:-top-56 md:size-[520px] bg-brand-on-dark/30`}
      />
      {/* green-500 at ~13%, behind the form card */}
      <div
        className={`${glow} bottom-[10%] left-1/2 size-[320px] -translate-x-1/2 bg-brand/13 md:size-[520px] lg:top-[22%] lg:bottom-auto lg:left-[calc(50%+380px)]`}
      />

      <div className="hero-grid absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 h-[22%] bg-linear-to-b from-transparent to-canvas" />
    </div>
  );
}
