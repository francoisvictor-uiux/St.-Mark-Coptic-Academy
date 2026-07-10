"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useBookmarks } from "@/lib/bookmarks";
import { BookmarkIcon, ShareIcon, PrinterIcon, DownloadIcon } from "../icons";

/** Hero utility bar: bookmark, share, print, and optional PDF download. */
export default function ArticleActions({
  slug,
  title,
  pdfUrl,
}: {
  slug: string;
  title: string;
  pdfUrl?: string | null;
}) {
  const t = useTranslations("articleReader");
  const locale = useLocale();
  const { has, toggle } = useBookmarks();
  const bookmarked = has(slug);
  const [toast, setToast] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function flash(msg: string) {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 2200);
  }

  async function share() {
    const url = `${window.location.origin}/${locale}/articles/${slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* dismissed */
      }
    } else {
      await navigator.clipboard?.writeText(url);
      flash(t("linkCopied"));
    }
  }

  const btn =
    "inline-flex h-10 items-center gap-2 rounded-full border px-3.5 font-sans text-[13px] font-bold transition-colors";

  return (
    <div className="no-print flex flex-wrap items-center gap-2.5">
      <button
        type="button"
        onClick={() => toggle(slug)}
        aria-pressed={bookmarked}
        aria-label={bookmarked ? t("bookmarked") : t("bookmark")}
        className={`${btn} ${
          bookmarked ? "border-red-500 bg-red-500 text-creamy-50" : "border-line bg-card text-brown-500 hover:border-brown-400"
        }`}
      >
        <BookmarkIcon filled={bookmarked} className="size-[17px]" />
        <span className="hidden sm:inline">{bookmarked ? t("bookmarked") : t("bookmark")}</span>
      </button>

      <button type="button" onClick={share} className={`${btn} border-line bg-card text-brown-500 hover:border-brown-400`}>
        <ShareIcon className="size-[16px]" />
        <span className="hidden sm:inline">{t("share")}</span>
      </button>

      <button type="button" onClick={() => window.print()} className={`${btn} border-line bg-card text-brown-500 hover:border-brown-400`}>
        <PrinterIcon className="size-[16px]" />
        <span className="hidden sm:inline">{t("print")}</span>
      </button>

      {pdfUrl ? (
        <a href={pdfUrl} download className={`${btn} border-line bg-card text-brown-500 hover:border-brown-400`}>
          <DownloadIcon className="size-[16px]" />
          <span className="hidden sm:inline">{t("download")}</span>
        </a>
      ) : null}

      <span role="status" aria-live="polite" className="sr-only">
        {toast}
      </span>
      {toast ? (
        <span className="pointer-events-none fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-full bg-brown-900 px-4 py-2 font-sans text-[13px] font-bold text-creamy-50 shadow-lg">
          {toast}
        </span>
      ) : null}
    </div>
  );
}
