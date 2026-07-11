"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { ApiError, activateAccount } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import FormBanner from "./FormBanner";
import SubmitButton from "./SubmitButton";
import { ShieldIcon } from "./icons";

/** User activates an admin-approved account via the emailed link, then is
 *  logged straight in (mirrors AcceptInviteForm, but no password step —
 *  the password was set at registration). */
export default function ActivateForm({ token }: { token: string }) {
  const t = useTranslations("auth.activate");
  const locale = useLocale();
  const router = useRouter();
  const { setUser } = useAuth();

  const [banner, setBanner] = useState<{ tone: "danger"; text: string; expired?: boolean } | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");

  async function handleActivate() {
    setBanner(null);
    setState("loading");
    try {
      const user = await activateAccount(token);
      setUser(user);
      setState("success");
      setTimeout(() => router.push(user.user_type === "student" ? "/portal" : "/admin"), 600);
    } catch (error) {
      setState("idle");
      if (error instanceof ApiError && error.code === "invalid_activation") {
        setBanner({ tone: "danger", text: t("errors.expired"), expired: true });
      } else {
        setBanner({
          tone: "danger",
          text: error instanceof ApiError ? error.localized(locale) : t("errors.network"),
        });
      }
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <p className="font-serif text-[16px] text-brown-400">{t("missingToken")}</p>
        <Link href="/login" className="mt-4 inline-block font-serif text-[15px] font-bold text-blue-500 underline-offset-4 hover:underline">
          {t("goLogin")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-blue-50">
          <ShieldIcon className="size-6 text-blue-500" />
        </span>
        <div>
          <h1 className="font-display text-[28px] font-bold leading-9 text-brown-900">{t("title")}</h1>
          <p className="mt-2 font-serif text-[16px] font-light leading-relaxed text-brown-400">{t("subtitle")}</p>
        </div>
      </div>

      {banner ? (
        <FormBanner tone={banner.tone}>
          {banner.text}
          {banner.expired ? (
            <>
              {" "}
              <Link href="/login" className="font-bold text-brown-500 underline-offset-4 hover:underline">
                {t("goLogin")}
              </Link>
            </>
          ) : null}
        </FormBanner>
      ) : null}

      <SubmitButton type="button" state={state} onClick={handleActivate}>
        {t("cta")}
      </SubmitButton>
    </div>
  );
}
