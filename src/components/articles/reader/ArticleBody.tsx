"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { XIcon } from "../icons";

/**
 * Renders the server-sanitized article HTML and adds an image lightbox: every
 * <img> becomes zoomable via click/keyboard. Body is already sanitized upstream
 * (nh3 whitelist), so dangerouslySetInnerHTML is safe here.
 */
export default function ArticleBody({ html, dir }: { html: string; dir: "ltr" | "rtl" }) {
  const t = useTranslations("articleReader");
  const ref = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const imgs = Array.from(root.querySelectorAll("img"));
    const cleanups: Array<() => void> = [];

    imgs.forEach((img) => {
      img.style.cursor = "zoom-in";
      img.setAttribute("tabindex", "0");
      img.setAttribute("role", "button");
      if (!img.getAttribute("aria-label")) img.setAttribute("aria-label", t("imageZoom"));

      const open = () => setZoom({ src: img.getAttribute("src") || "", alt: img.getAttribute("alt") || "" });
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      };
      img.addEventListener("click", open);
      img.addEventListener("keydown", onKey);
      cleanups.push(() => {
        img.removeEventListener("click", open);
        img.removeEventListener("keydown", onKey);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [html, t]);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoom]);

  return (
    <>
      <div
        id="article-body"
        ref={ref}
        dir={dir}
        className="article-body font-serif text-brown-900"
        // Server-sanitized (nh3 whitelist) before storage — safe to render.
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {zoom ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={zoom.alt || t("imageZoom")}
          onClick={() => setZoom(null)}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-brown-900/90 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            aria-label={t("closeImage")}
            onClick={() => setZoom(null)}
            className="absolute end-5 top-5 flex size-11 items-center justify-center rounded-full bg-creamy-50/10 text-creamy-50 transition-colors hover:bg-creamy-50/20"
          >
            <XIcon className="size-6" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={zoom.src}
            alt={zoom.alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain shadow-2xl"
          />
        </div>
      ) : null}
    </>
  );
}
