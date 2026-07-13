"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const CREAM = "#FEF6F0"; // page-cream — the emblem colour

// loading.svg rendered in cream via mask (preserves its shapes and text holes).
// Starts hidden so there's no first-paint flash before GSAP fades it in.
const EMBLEM: React.CSSProperties = {
  opacity: 0,
  backgroundColor: CREAM,
  WebkitMaskImage: "url(/loading.svg)",
  maskImage: "url(/loading.svg)",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
  WebkitMaskSize: "contain",
  maskSize: "contain",
};

// Brown sheet with a cross-shaped HOLE punched out of it (Cross.svg used as an
// *inverted* mask via xor/exclude: the sheet is everything EXCEPT the cross).
//
// The key difference from the old, laggy version: the cross mask size is FIXED.
// The reveal is done by animating `transform: scale()` on this element, NOT by
// animating `mask-size`. CSS applies the mask first and the transform after, so
// the browser rasterizes the cross once and then scales that texture on the GPU
// — no per-frame mask re-rasterization, which is what caused the stutter.
const CROSS_SIZE = "clamp(140px, 34vw, 360px)";
const CROSS_REVEAL: React.CSSProperties = {
  WebkitMaskImage: "url(/Cross.svg), linear-gradient(#000, #000)",
  maskImage: "url(/Cross.svg), linear-gradient(#000, #000)",
  WebkitMaskRepeat: "no-repeat, no-repeat",
  maskRepeat: "no-repeat, no-repeat",
  WebkitMaskPosition: "center, center",
  maskPosition: "center, center",
  WebkitMaskSize: `${CROSS_SIZE}, cover`,
  maskSize: `${CROSS_SIZE}, cover`,
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
  willChange: "transform",
};

/**
 * Full-screen intro overlay shown on every hard page load. The hero pauses its
 * entrance while `[data-preloader]` is in the DOM and resumes on the
 * `preloader:done` window event.
 *
 * On exit the emblem fades and a cross-shaped hole grows to reveal the page.
 * The growth is a pure `transform: scale()` on the pre-masked sheet (see
 * CROSS_REVEAL) so it stays on the compositor and doesn't re-raster the mask.
 */
export default function Preloader() {
  const t = useTranslations("misc");
  const ref = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      document.body.style.overflow = "hidden";

      const finish = () => {
        document.body.style.removeProperty("overflow");
        setDone(true);
      };

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set("[data-loader-emblem]", { autoAlpha: 0 });
        gsap
          .timeline({ defaults: { ease: "power2.out" }, onComplete: finish })
          // Emblem fades in (opacity only — no mask re-raster).
          .to("[data-loader-emblem]", { autoAlpha: 1, duration: 0.5 })
          .addLabel("exit", "+=0.2")
          // Fade the emblem out as the reveal begins.
          .to("[data-loader-emblem]", { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, "exit")
          // Grow the cross-shaped hole by scaling the sheet — transform only, so
          // the GPU scales the already-rasterized mask (smooth). Scale is large
          // enough for the hole to clear the viewport on wide screens.
          .to(
            ref.current,
            {
              scale: 9,
              duration: 0.85,
              ease: "power2.in",
              transformOrigin: "50% 50%",
              // Let the hero begin its entrance while the cross opens.
              onStart: () => window.dispatchEvent(new Event("preloader:done")),
            },
            "exit",
          );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-loader-emblem]", { autoAlpha: 1 });
        window.dispatchEvent(new Event("preloader:done"));
        gsap.to(ref.current, { autoAlpha: 0, duration: 0.4, onComplete: finish });
      });
    },
    { scope: ref },
  );

  if (done) return null;

  return (
    <div
      ref={ref}
      data-preloader
      role="status"
      aria-label={t("loading")}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-brown-500"
      style={CROSS_REVEAL}
    >
      <div className="relative flex flex-col items-center px-6">
        {/* Cream loading emblem (loading.svg via mask) */}
        <div data-loader-emblem aria-hidden="true" className="aspect-[860/640] w-[min(460px,72vw)]" style={EMBLEM} />
      </div>
    </div>
  );
}
