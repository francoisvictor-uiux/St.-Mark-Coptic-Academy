import Image from "next/image";
import { useTranslations, useMessages } from "next-intl";
import { Link } from "@/i18n/navigation";
import SectionHeader from "@/components/ui/SectionHeader";
import PillButton from "@/components/ui/PillButton";
import ArrowIcon from "@/components/ui/ArrowIcon";
import Reveal from "@/components/ui/Reveal";

type ProgramItem = {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: "open" | "soon" | "closed";
  image: string;
  /** Optional enrichment — falls back to sensible academy-wide defaults. */
  faculty?: string;
  language?: string;
  mode?: string;
  award?: string;
};

const STATUS_STYLES: Record<ProgramItem["status"], string> = {
  open: "bg-red-50 text-red-800 ring-red-800/10",
  soon: "bg-creamy-300 text-brown-500 ring-brown-500/10",
  closed: "bg-ink-50 text-ink-400 ring-ink-400/10",
};

/* ── info-row icons (1.5px stroke, inherit currentColor) ── */
const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "size-[17px]",
  "aria-hidden": true,
};
const DurationIcon = () => (
  <svg {...iconProps}><circle cx="12" cy="12.5" r="7.5" /><path d="M12 8.6V12.5l2.6 1.7" /><path d="M9 3.5h6" /></svg>
);
const ModeIcon = () => (
  <svg {...iconProps}><path d="M4 9.5 12 5l8 4.5" /><path d="M5.5 9.7V19M18.5 9.7V19M9 10v9M15 10v9" /><path d="M3.5 19h17" /></svg>
);
const LanguageIcon = () => (
  <svg {...iconProps}><circle cx="12" cy="12" r="8.2" /><path d="M3.8 12h16.4M12 3.8c2.4 2.2 3.6 5.1 3.6 8.2s-1.2 6-3.6 8.2c-2.4-2.2-3.6-5.1-3.6-8.2S9.6 6 12 3.8Z" /></svg>
);
const AwardIcon = () => (
  <svg {...iconProps}><circle cx="12" cy="10" r="5.4" /><path d="m9.4 14.6-1.6 6 4.2-2.4 4.2 2.4-1.6-6" /><path d="m9.9 10 1.5 1.5L14.2 8.7" /></svg>
);

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <span className="grid size-9 flex-none place-items-center rounded-[10px] border border-line bg-brown-500/[0.04] text-brown-500">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-sans text-[10px] font-semibold uppercase tracking-[0.09em] text-brown-400">{label}</span>
        <span className="mt-0.5 block truncate font-serif text-[13.5px] font-medium text-brown-900">{value}</span>
      </span>
    </div>
  );
}

function ProgramCard({
  program,
  t,
}: {
  program: ProgramItem;
  t: ReturnType<typeof useTranslations>;
}) {
  const language = program.language ?? t("info.languageValue");
  const mode = program.mode ?? t("info.modeValue");
  const award = program.award ?? t("info.awardValue");

  return (
    <article
      data-reveal
      className="group flex flex-col overflow-hidden rounded-[20px] border border-line bg-creamy-50 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-brown-200 hover:shadow-[0_26px_54px_-26px_rgba(86,40,35,0.5)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {/* Featured image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={program.image}
          alt=""
          fill
          sizes="(min-width: 1280px) 300px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[650ms] ease-out group-hover:scale-[1.06] motion-reduce:group-hover:scale-100"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(36,17,15,0.34),rgba(36,17,15,0.04)_36%,transparent_66%,rgba(36,17,15,0.14))]"
        />
        <span
          className={`absolute top-4 start-4 inline-flex items-center rounded-full px-3 py-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.08em] shadow-sm ring-1 backdrop-blur-md transition-transform duration-300 ease-out group-hover:scale-105 ${STATUS_STYLES[program.status]}`}
        >
          {t(`status.${program.status}`)}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {program.faculty ? (
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-brown-400">{program.faculty}</p>
        ) : null}
        <h3 className={`${program.faculty ? "mt-2" : ""} font-serif text-[21px] font-bold leading-snug text-balance text-brown-900`}>
          <Link
            href="/programs"
            className="rounded-sm outline-none transition-colors hover:text-brown-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brown-500"
          >
            {program.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 font-serif text-[14.5px] font-light leading-[1.6] text-brown-400">
          {program.description}
        </p>

        {/* Information row */}
        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-line pt-5">
          <InfoItem icon={<DurationIcon />} label={t("duration")} value={program.duration} />
          <InfoItem icon={<ModeIcon />} label={t("info.mode")} value={mode} />
          <InfoItem icon={<LanguageIcon />} label={t("info.language")} value={language} />
          <InfoItem icon={<AwardIcon />} label={t("info.award")} value={award} />
        </dl>

        {/* Actions */}
        <div className="mt-auto flex gap-3 border-t border-line pt-5 max-[380px]:flex-col">
          <Link
            href="/programs"
            className="inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-xl bg-brown-500 px-4 font-serif text-[15px] font-bold text-creamy-50 transition-[background-color,transform] duration-200 hover:bg-brown-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-500 active:scale-[0.98]"
          >
            {t("learnMore")}
            <ArrowIcon className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:rtl:-translate-x-0.5" />
          </Link>
          <Link
            href="/register"
            className="inline-flex min-h-[46px] flex-1 items-center justify-center rounded-xl border border-line px-4 font-serif text-[15px] font-bold text-brown-500 transition-colors duration-200 hover:border-brown-400 hover:bg-brown-500/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-500 active:scale-[0.98]"
          >
            {t("apply")}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Programs({ items: itemsProp, labels }: { items?: ProgramItem[]; labels?: { label?: string; subtitle?: string } }) {
  const t = useTranslations("programs");
  const messages = useMessages() as {
    programs: { items: ProgramItem[] };
  };
  const programs = itemsProp && itemsProp.length > 0 ? itemsProp : messages.programs.items;

  return (
    <section id="programs" aria-labelledby="programs-label" className="bg-creamy-100 py-16 md:py-24">
      <Reveal className="mx-auto flex max-w-[1248px] flex-col gap-10 px-4 md:gap-14 md:px-8">
        <SectionHeader label={labels?.label || t("label")} subtitle={labels?.subtitle || t("subtitle")} />

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} t={t} />
          ))}
        </div>

        <div className="flex justify-center" data-reveal>
          <PillButton href="/programs" variant="outline">
            {t("showAll")}
          </PillButton>
        </div>
      </Reveal>
    </section>
  );
}
