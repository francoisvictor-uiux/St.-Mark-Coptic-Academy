"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { XIcon } from "../icons";

/** Featured cover with a click/keyboard lightbox. */
export default function CoverImage({ src, alt }: { src: string; alt: string }) {
  const t = useTranslations("articleReader");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("imageZoom")}
        className="group relative block aspect-[16/9] w-full cursor-zoom-in overflow-hidden rounded-card"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 760px) 760px, 100vw"
          className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
          priority
        />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt || t("imageZoom")}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-brown-900/90 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            aria-label={t("closeImage")}
            onClick={() => setOpen(false)}
            className="absolute end-5 top-5 flex size-11 items-center justify-center rounded-full bg-creamy-50/10 text-creamy-50 transition-colors hover:bg-creamy-50/20"
          >
            <XIcon className="size-6" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain shadow-2xl"
          />
        </div>
      ) : null}
    </>
  );
}
