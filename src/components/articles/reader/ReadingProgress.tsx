"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Sticky top progress bar + a "minutes left" pill. Tracks scroll over the
 * article body element (id="article-body"). Compositor-only transform; the pill
 * is aria-hidden ambient info — screen readers navigate by headings/landmarks.
 */
export default function ReadingProgress({ minutes }: { minutes: number }) {
  const t = useTranslations("articleReader");
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const el = document.getElementById("article-body");
    if (!el) return;
    let raf = 0;

    const calc = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const start = rect.top + window.scrollY;
      const total = el.offsetHeight - window.innerHeight * 0.4;
      const scrolled = window.scrollY - start;
      const f = total > 0 ? scrolled / total : scrolled > 0 ? 1 : 0;
      setPct(Math.min(1, Math.max(0, f)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(calc);
    };

    calc();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const minutesLeft = Math.max(0, Math.round(minutes * (1 - pct)));

  return (
    <>
      <div aria-hidden="true" className="no-print fixed inset-x-0 top-0 z-[60] h-[3px] bg-brown-900/5">
        <div
          className="h-full w-full origin-left bg-red-500 transition-transform duration-150 ease-out will-change-transform motion-reduce:transition-none rtl:origin-right"
          style={{ transform: `scaleX(${pct})` }}
        />
      </div>
      <div
        aria-hidden="true"
        className={`no-print fixed bottom-5 end-5 z-[55] rounded-full border border-line bg-card/95 px-3.5 py-1.5 font-sans text-[12.5px] font-bold text-brown-500 shadow-[0_10px_30px_-12px_rgba(86,40,35,0.5)] backdrop-blur transition-opacity duration-300 motion-reduce:transition-none ${
          pct > 0.02 && pct < 0.985 ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {t("minLeft", { minutes: minutesLeft })}
      </div>
    </>
  );
}
