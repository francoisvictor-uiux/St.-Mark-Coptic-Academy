"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * Magnetic hover (Olivier Larose technique): the wrapped element is pulled a
 * fraction of the way toward the cursor while hovered, and springs back with an
 * elastic ease on leave. Mouse pointers only.
 */
export default function Magnetic({
  children,
  strength = 0.35,
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
      const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const { left, top, width, height } = el.getBoundingClientRect();
        xTo((e.clientX - (left + width / 2)) * strength);
        yTo((e.clientY - (top + height / 2)) * strength);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref, dependencies: [strength] },
  );

  return (
    <span ref={ref} className="inline-flex [will-change:transform]">
      {children}
    </span>
  );
}
