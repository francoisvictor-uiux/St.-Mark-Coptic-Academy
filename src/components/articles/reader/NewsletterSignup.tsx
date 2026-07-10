"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/** End-of-article newsletter CTA (reuses the articlesPage.newsletter copy). */
export default function NewsletterSignup() {
  const t = useTranslations("articlesPage.newsletter");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="no-print my-16 overflow-hidden rounded-[28px] border border-line bg-brown-500 px-6 py-12 text-center text-creamy-100 md:px-12 md:py-14">
      <div aria-hidden className="mx-auto mb-4 text-[13px] tracking-[10px] text-creamy-100/40">✢ ✦ ✢</div>
      <h2 className="text-balance font-display text-[24px] font-bold md:text-[30px]">{t("title")}</h2>
      <p className="mx-auto mt-3 max-w-[460px] font-serif text-[15.5px] font-light text-creamy-100/75">{t("subtitle")}</p>
      {done ? (
        <p className="mt-6 font-serif text-[16px] text-creamy-100" role="status">
          {t("thanks")}
        </p>
      ) : (
        <form
          className="mx-auto mt-7 flex max-w-[440px] flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) setDone(true);
          }}
        >
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            dir="ltr"
            required
            autoComplete="email"
            aria-label={t("emailLabel")}
            placeholder={t("placeholder")}
            className="h-12 flex-1 rounded-full bg-creamy-50 px-5 font-serif text-[15px] text-brown-900 placeholder:text-brown-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brown-500"
          />
          <button
            type="submit"
            className="rounded-full bg-red-500 px-7 py-3 font-sans text-[14.5px] font-bold text-creamy-50 transition-colors hover:bg-red-600"
          >
            {t("cta")}
          </button>
        </form>
      )}
    </section>
  );
}
