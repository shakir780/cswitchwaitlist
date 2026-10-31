"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Transparent over the hero glow, then solid once the page scrolls under it. */
export function StickyHeader({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      data-scrolled={scrolled || undefined}
      className="sticky top-0 z-40 transition-[background-color,box-shadow] duration-200 data-scrolled:bg-canvas/90 data-scrolled:shadow-[0_1px_0_var(--color-line)] data-scrolled:backdrop-blur-md"
    >
      {children}
    </header>
  );
}
