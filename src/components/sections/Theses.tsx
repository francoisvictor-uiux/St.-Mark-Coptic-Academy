"use client";

import { useRef } from "react";
import { useTranslations, useMessages } from "next-intl";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SectionHeader from "@/components/ui/SectionHeader";
import PillButton from "@/components/ui/PillButton";
import Reveal from "@/components/ui/Reveal";

gsap.registerPlugin(useGSAP);

type ThesisItem = {
  title: string;
  researcher: string;
  degree: string;
  institution: string;
  year: string;
};

type Translate = ReturnType<typeof useTranslations>;

/** One thesis card: dark by default, with a creamy #FEF6F0 layer that draws in
 *  from wherever the pointer enters. The creamy layer carries its OWN dark text,
 *  so contrast is WCAG-AA at every frame — never a washed-out mid-transition. */
function ThesisCard({ thesis, t }: { thesis: ThesisItem; t: Translate }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe) return;

      const enter = contextSafe((e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        // Radius that always reaches the farthest corner from the entry point.
        const radius = Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y));
        gsap.set(el, { "--cx": `${x}px`, "--cy": `${y}px` });
        gsap.to(el, { "--cr": `${radius + 8}px`, duration: 0.55, ease: "power2.out", overwrite: true });
      });
      const leave = contextSafe(() => {
        gsap.to(el, { "--cr": "0px", duration: 0.45, ease: "power2.in", overwrite: true });
      });

      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref },
  );

  const body = (dark: boolean) => (
    <>
      <span className="w-fit rounded-full bg-red-500/90 px-3.5 py-1 font-serif text-[13px] font-bold text-creamy-50">
        {thesis.degree}
      </span>
      <h3 className={`flex-1 font-serif text-[17px] font-bold leading-[1.7] ${dark ? "text-brown-900" : "text-creamy-50"}`}>
        {thesis.title}
      </h3>
      <dl
        className={`flex flex-col gap-1.5 border-t pt-4 font-serif text-sm font-light ${
          dark ? "border-brown-900/15 text-brown-800" : "border-creamy-100/15 text-creamy-100/80"
        }`}
      >
        <div className="flex gap-2">
          <dt className={dark ? "text-brown-500" : "text-creamy-100/70"}>{t("researcher")}:</dt>
          <dd>{thesis.researcher}</dd>
        </div>
        <div className="flex gap-2">
          <dd>{thesis.institution}</dd>
        </div>
        <div className="flex gap-2">
          <dt className={dark ? "text-brown-500" : "text-creamy-100/70"}>{t("year")}:</dt>
          <dd dir="ltr">{thesis.year}</dd>
        </div>
      </dl>
    </>
  );

  const mask =
    "radial-gradient(circle var(--cr,0px) at var(--cx,50%) var(--cy,50%), #000 72%, transparent 100%)";

  return (
    <article
      ref={ref}
      data-reveal
      className="group relative overflow-hidden rounded-[28px] border border-creamy-100/15 bg-[#603430] [--cr:0px] [--cx:50%] [--cy:50%]"
    >
      {/* Base — light text on the dark card (always readable) */}
      <div className="relative z-0 flex h-full flex-col gap-4 p-6">{body(false)}</div>
      {/* Draw-in overlay — dark text on #FEF6F0, revealed by the pointer mask */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 flex flex-col gap-4 bg-[#FEF6F0] p-6"
        style={{ WebkitMaskImage: mask, maskImage: mask }}
      >
        {body(true)}
      </div>
    </article>
  );
}

export default function Theses({ items: itemsProp, labels }: { items?: ThesisItem[]; labels?: { label?: string; subtitle?: string } }) {
  const t = useTranslations("theses");
  const messages = useMessages() as {
    theses: { items: ThesisItem[] };
  };
  const theses = itemsProp && itemsProp.length > 0 ? itemsProp : messages.theses.items;
  const gridRef = useRef<HTMLDivElement>(null);
  const brushRef = useRef<HTMLDivElement>(null);

  // Pink #D46A6B brush that paints the band background under the moving pointer
  // and fades away on leave. Lives behind the opaque cards, so it only ever
  // shows in the gaps — never behind reading text.
  useGSAP(
    () => {
      const grid = gridRef.current;
      const brush = brushRef.current;
      if (!grid || !brush) return;
      const mxTo = gsap.quickTo(brush, "--mx", { duration: 0.5, ease: "power3.out" });
      const myTo = gsap.quickTo(brush, "--my", { duration: 0.5, ease: "power3.out" });

      const enter = (e: PointerEvent) => {
        const r = brush.getBoundingClientRect();
        // Prime the brush at the entry point (2nd arg = start) so it doesn't
        // sweep in from off-screen, then fade the paint in.
        mxTo(e.clientX - r.left, e.clientX - r.left);
        myTo(e.clientY - r.top, e.clientY - r.top);
        gsap.to(brush, { opacity: 1, duration: 0.4, ease: "power2.out", overwrite: true });
      };
      const move = (e: PointerEvent) => {
        const r = brush.getBoundingClientRect();
        mxTo(e.clientX - r.left);
        myTo(e.clientY - r.top);
      };
      const leave = () => gsap.to(brush, { opacity: 0, duration: 0.55, ease: "power2.out", overwrite: true });

      grid.addEventListener("pointerenter", enter);
      grid.addEventListener("pointermove", move);
      grid.addEventListener("pointerleave", leave);
      return () => {
        grid.removeEventListener("pointerenter", enter);
        grid.removeEventListener("pointermove", move);
        grid.removeEventListener("pointerleave", leave);
      };
    },
    { scope: gridRef },
  );

  const brushMask =
    "radial-gradient(circle 180px at calc(var(--mx,-9999) * 1px) calc(var(--my,-9999) * 1px), #000 0%, #000 30%, transparent 72%)";

  return (
    <section id="theses" aria-labelledby="theses-label" className="bg-creamy-100 py-8 md:py-12">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        {/* Dark editorial band, echoing the vision card surface */}
        <Reveal>
          <div className="rounded-card bg-brown-500 px-6 py-14 md:px-14 md:py-20">
            <div className="mx-auto flex max-w-[1248px] flex-col gap-10 md:gap-14 [&_h2]:text-creamy-100 [&_svg]:text-creamy-100 [&_p]:text-creamy-100/70">
              <SectionHeader label={labels?.label || t("label")} subtitle={labels?.subtitle || t("subtitle")} />
            </div>

            <div ref={gridRef} className="relative mx-auto mt-10 max-w-[1248px] md:mt-14">
              {/* Pink brush layer (behind the cards) */}
              <div
                ref={brushRef}
                aria-hidden="true"
                className="pointer-events-none absolute -inset-4 z-0 rounded-[36px] bg-[#D46A6B]"
                style={
                  {
                    opacity: 0,
                    "--mx": -9999,
                    "--my": -9999,
                    WebkitMaskImage: brushMask,
                    maskImage: brushMask,
                  } as React.CSSProperties
                }
              />
              <div className="relative z-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {theses.map((thesis) => (
                  <ThesisCard key={thesis.title} thesis={thesis} t={t} />
                ))}
              </div>
            </div>

            <div className="mt-10 flex justify-center md:mt-14" data-reveal>
              <PillButton href="/theses" variant="light" withArrow>
                {t("showAll")}
              </PillButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
