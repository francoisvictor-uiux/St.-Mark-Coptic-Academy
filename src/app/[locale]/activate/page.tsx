import { setRequestLocale } from "next-intl/server";
import AuthShell from "@/components/auth/AuthShell";
import ActivateForm from "@/components/auth/ActivateForm";

export default async function ActivatePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale } = await params;
  const { token } = await searchParams;
  setRequestLocale(locale);
  return (
    <AuthShell>
      <ActivateForm token={token ?? ""} />
    </AuthShell>
  );
}
