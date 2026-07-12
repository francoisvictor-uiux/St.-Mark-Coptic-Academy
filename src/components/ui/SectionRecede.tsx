"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Perspective handoff: as this section scrolls up and out, it scales down and
 * tilts back in perspective while a dark overlay fades in — so it reads as
 * receding into the distance while the next section rises over it. Scroll-
 * scrubbed (synced to the smooth scroll); the transform lives on an inner node
 * so it never feeds back into the ScrollTrigger's measurements.
 */
export default function SectionRecede({ children }: { children: React.ReactNode }) {
  const trigger = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!trigger.current || !inner.current || !overlay.current) return;
      const st = { trigger: trigger.current, start: "bottom bottom", end: "bottom top", scrub: 0.5 };
      gsap.set(inner.current, { transformPerspective: 1400, transformOrigin: "50% 45%" });
      gsap.to(inner.current, { scale: 0.9, rotationX: 8, ease: "none", scrollTrigger: st });
      gsap.to(overlay.current, { opacity: 0.42, ease: "none", scrollTrigger: st });
    },
    { scope: trigger },
  );

  return (
    <div ref={trigger} className="relative">
      <div ref={inner} className="relative [will-change:transform]">
        {children}
        <div
          ref={overlay}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-brown-900 opacity-0"
        />
      </div>
    </div>
  );
}
