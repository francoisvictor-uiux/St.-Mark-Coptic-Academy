"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { ArticleHeading } from "@/lib/article-toc";
import { ListIcon, ChevronDown } from "../icons";

/**
 * Auto-generated table of contents with scroll-spy. `desktop` renders a sticky
 * sidebar; `mobile` renders a collapsible disclosure placed above the article.
 * Both read server-provided heading ids so anchors are deterministic.
 */
export default function ArticleToc({
  headings,
  variant,
}: {
  headings: ArticleHeading[];
  variant: "desktop" | "mobile";
}) {
  const t = useTranslations("articleReader");
  const [active, setActive] = useState(headings[0]?.id ?? "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((e): e is HTMLElement => e !== null);
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -68% 0px", threshold: 0 },
    );
    els.forEach((e) => obs.observe(e));
    return () => obs.disconnect();
  }, [headings]);

  function go(e: React.MouseEvent, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(id);
      history.replaceState(null, "", `#${id}`);
    }
    setOpen(false);
  }

  const list = (
    <ul className="flex flex-col gap-0.5">
      {headings.map((h) => (
        <li key={h.id} style={h.level === 3 ? { paddingInlineStart: "0.85rem" } : undefined}>
          <a
            href={`#${h.id}`}
            onClick={(e) => go(e, h.id)}
            aria-current={active === h.id ? "location" : undefined}
            className={`block border-s-2 py-1.5 ps-3 font-sans text-[13px] leading-snug transition-colors ${
              active === h.id
                ? "border-red-500 font-bold text-brown-900"
                : "border-line text-brown-300 hover:border-brown-300 hover:text-brown-500"
            }`}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  );

  if (variant === "mobile") {
    return (
      <nav aria-label={t("tocTitle")} className="no-print mb-9 rounded-2xl border border-line bg-card xl:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-2 px-4 py-3.5 font-sans text-[13.5px] font-bold text-brown-500"
        >
          <span className="inline-flex items-center gap-2">
            <ListIcon className="size-4" />
            {t("tocTitle")}
          </span>
          <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open ? <div className="border-t border-line px-4 py-3">{list}</div> : null}
      </nav>
    );
  }

  return (
    <nav
      aria-label={t("tocTitle")}
      className="no-print sticky top-[100px] hidden max-h-[calc(100vh-140px)] overflow-y-auto pb-6 xl:block"
    >
      <p className="mb-3 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brown-300">
        {t("tocTitle")}
      </p>
      {list}
    </nav>
  );
}
