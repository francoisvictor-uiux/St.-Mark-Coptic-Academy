"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const BROWN = "#562823"; // brand brown — the loading sheet
const CREAM = "#FEF6F0"; // page-background cream — the cross

// Full-cover sheet (flat bottom) → sheet with an upward curve carved out.
const FLAT = "M0 0 L100 0 L100 100 Q50 100 0 100 Z";
const CURVED = "M0 0 L100 0 L100 100 Q50 42 0 100 Z";

const CROSS_MASK: React.CSSProperties = {
  backgroundColor: CREAM,
  WebkitMaskImage: "url(/Cross.svg)",
  maskImage: "url(/Cross.svg)",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
  WebkitMaskSize: "contain",
  maskSize: "contain",
};

/**
 * Full-screen intro overlay shown on every hard page load. Brand-brown sheet
 * with the creamy Cross emblem; on exit the sheet's bottom edge morphs into a
 * curve and slides up to reveal the page (Olivier Larose SVG-curve reveal).
 * The hero begins its entrance on the `preloader:done` window event.
 */
export default function Preloader() {
  const t = useTranslations("misc");
  const rootRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      document.body.style.overflow = "hidden";

      const cleanup = () => {
        document.body.style.removeProperty("overflow");
        setDone(true);
      };
      const dispatchDone = () => window.dispatchEvent(new Event("preloader:done"));

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" }, onComplete: cleanup })
          // Cross rises into place
          .from("[data-loader-emblem]", { autoAlpha: 0, scale: 0.9, y: 26, duration: 1.0 })
          // Hairline draws underneath like an ink stroke
          .fromTo(
            "[data-loader-line]",
            { scaleX: 0 },
            { scaleX: 1, transformOrigin: "center", duration: 0.9, ease: "power2.inOut" },
            "-=0.5",
          )
          // Hold, then the emblem drifts up and fades
          .to(["[data-loader-emblem]", "[data-loader-line]"], { autoAlpha: 0, y: -28, duration: 0.5, ease: "power2.in" }, "+=0.35")
          // The bottom edge curves…
          .to(pathRef.current, { attr: { d: CURVED }, duration: 0.65, ease: "power2.in" }, "-=0.15")
          // …and the whole sheet peels up to reveal the page
          .to(
            sheetRef.current,
            { yPercent: -110, duration: 0.95, ease: "power4.inOut", onStart: dispatchDone },
            "-=0.4",
          );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.timeline({ onComplete: () => { dispatchDone(); cleanup(); } }).to(rootRef.current, {
          autoAlpha: 0,
          duration: 0.4,
        });
      });
    },
    { scope: rootRef },
  );

  if (done) return null;

  return (
    <div
      ref={rootRef}
      data-preloader
      role="status"
      aria-label={t("loading")}
      className="fixed inset-0 z-[100] overflow-hidden bg-brown-500"
    >
      <div ref={sheetRef} className="absolute inset-0">
        {/* Brown sheet as an SVG path so its bottom edge can curve on exit */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <path ref={pathRef} d={FLAT} fill={BROWN} />
        </svg>

        {/* Creamy Cross emblem + hairline */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-6">
          <div data-loader-emblem aria-hidden="true" className="size-32 md:size-40" style={CROSS_MASK} />
          <div data-loader-line aria-hidden="true" className="h-px w-40 origin-center bg-creamy-100/40" />
        </div>
      </div>
    </div>
  );
}
