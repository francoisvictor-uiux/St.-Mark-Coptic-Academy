import CopticCross from "./CopticCross";

type SectionHeaderProps = {
  label: string;
  subtitle?: string;
};

/**
 * Universal section header from the Figma design language:
 * centered brand-brown label + 24px logo emblem, optional muted subtitle below.
 */
export default function SectionHeader({ label, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex items-center gap-2" data-reveal>
        <CopticCross className="size-6 shrink-0 text-brown-500" />
        <h2 className="font-serif text-[26px] leading-tight text-brown-500 md:text-[32px]">
          {label}
        </h2>
      </div>
      {subtitle ? (
        <p
          className="font-serif text-lg text-muted md:text-2xl md:leading-tight"
          data-reveal
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
