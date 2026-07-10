"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  LinkIcon,
  CheckIcon,
  FacebookIcon,
  LinkedInIcon,
  WhatsAppIcon,
  MailIcon,
  PrinterIcon,
} from "../icons";

/** Dedicated end-of-article share block: copy link + channels + print. */
export default function ShareSection({ slug, title }: { slug: string; title: string }) {
  const t = useTranslations("articleReader");
  const locale = useLocale();
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined" ? `${window.location.origin}/${locale}/articles/${slug}` : "";
  const enc = encodeURIComponent;

  function copy() {
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const channels = [
    { key: "fb", label: t("onFacebook"), Icon: FacebookIcon, href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { key: "li", label: t("onLinkedIn"), Icon: LinkedInIcon, href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { key: "wa", label: t("onWhatsApp"), Icon: WhatsAppIcon, href: `https://wa.me/?text=${enc(`${title} ${url}`)}` },
    { key: "mail", label: t("byEmail"), Icon: MailIcon, href: `mailto:?subject=${enc(title)}&body=${enc(url)}` },
  ];

  const circle =
    "flex size-11 items-center justify-center rounded-full border border-line bg-card text-brown-500 transition-colors hover:border-brown-400 hover:text-brown-900";

  return (
    <section aria-labelledby="share-heading" className="no-print my-14 border-y border-line py-8">
      <h2 id="share-heading" className="mb-4 font-display text-[18px] font-bold text-brown-900">
        {t("shareTitle")}
      </h2>
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-card px-4 font-sans text-[13px] font-bold text-brown-500 transition-colors hover:border-brown-400"
        >
          {copied ? <CheckIcon className="size-[17px] text-red-500" /> : <LinkIcon className="size-[16px]" />}
          {copied ? t("copied") : t("copyLink")}
        </button>
        {channels.map(({ key, label, Icon, href }) => (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={circle}>
            <Icon className="size-[18px]" />
          </a>
        ))}
        <button type="button" onClick={() => window.print()} aria-label={t("print")} className={circle}>
          <PrinterIcon className="size-[17px]" />
        </button>
      </div>
    </section>
  );
}
