import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  // Always land visitors on Arabic — don't sniff the browser language.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
