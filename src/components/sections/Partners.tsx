import Image from "next/image";
import { useTranslations } from "next-intl";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";

const PARTNERS = [
  { src: "/partners/partner-1.png", name: "Institute of Coptic Studies", w: 328 },
  { src: "/partners/partner-2.jpg", name: "Clerical College", w: 280 },
  { src: "/partners/partner-3.png", name: "Tanta University", w: 210 },
  { src: "/partners/partner-4.png", name: "Clerical College of Alexandria", w: 210 },
  { src: "/partners/partner-5.png", name: "Coptic Orthodox Theological College", w: 350 },
];

function LogoRow() {
  return (
    <>
      {PARTNERS.map((p) => (
        <Image
          key={p.src}
          src={p.src}
          alt={p.name}
          width={p.w}
          height={112}
          className="h-20 w-auto shrink-0 object-contain opacity-90 grayscale mix-blend-multiply transition-all duration-300 hover:opacity-100 hover:grayscale-0 md:h-28"
        />
      ))}
    </>
  );
}

/** Marquee half — rendered twice inside a track for a seamless loop. */
function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div
        className={`flex w-max items-center gap-14 pe-14 md:gap-[60px] md:pe-[60px] ${
          reverse ? "marquee-track-reverse" : "marquee-track"
        }`}
        style={{ "--marquee-duration": "36s" } as React.CSSProperties}
      >
        <LogoRow />
        <LogoRow />
        <LogoRow />
        <LogoRow />
      </div>
    </div>
  );
}

export default function Partners() {
  const t = useTranslations("partners");

  return (
    <section aria-label={t("label")} className="bg-creamy-100 py-16 md:py-24">
      <Reveal className="mx-auto flex max-w-[1248px] flex-col gap-10 px-4 md:gap-14 md:px-8">
        <SectionHeader label={t("label")} />
        <div className="marquee-paused flex flex-col opacity-70" data-reveal dir="ltr">
          <MarqueeRow />
        </div>
      </Reveal>
    </section>
  );
}
