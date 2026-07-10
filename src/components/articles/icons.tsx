/** Extra icons for the Articles page (Lucide outlines, 1.5px). */

type P = React.SVGProps<SVGSVGElement>;

function S({ children, ...p }: P & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      {children}
    </svg>
  );
}

export const BookmarkIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

export const ShareIcon = (p: P) => (
  <S {...p}>
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </S>
);

export const EyeIcon = (p: P) => (
  <S {...p}>
    <path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0" />
    <circle cx="12" cy="12" r="3" />
  </S>
);

export const ClockIcon = (p: P) => (
  <S {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></S>
);

export const SlidersIcon = (p: P) => (
  <S {...p}>
    <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
  </S>
);

export const ArrowIcon = (p: P) => (
  <S {...p}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></S>
);

export const XIcon = (p: P) => (
  <S {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></S>
);

export const SearchIcon = (p: P) => (
  <S {...p}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></S>
);

export const ChevronRight = (p: P) => (
  <S {...p}><polyline points="9 18 15 12 9 6" /></S>
);

export const ChevronDown = (p: P) => (
  <S {...p}><polyline points="6 9 12 15 18 9" /></S>
);

export const ListIcon = (p: P) => (
  <S {...p}>
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </S>
);

export const PrinterIcon = (p: P) => (
  <S {...p}>
    <path d="M6 9V2h12v7" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" rx="1" />
  </S>
);

export const DownloadIcon = (p: P) => (
  <S {...p}><path d="M12 3v12" /><path d="m7 12 5 5 5-5" /><path d="M5 21h14" /></S>
);

export const LinkIcon = (p: P) => (
  <S {...p}>
    <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
    <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
  </S>
);

export const CheckIcon = (p: P) => (
  <S {...p}><polyline points="20 6 9 17 4 12" /></S>
);

export const MailIcon = (p: P) => (
  <S {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></S>
);

/* Brand glyphs — filled paths (no stroke). */
const Brand = ({ children, ...p }: P & { children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>{children}</svg>
);

export const FacebookIcon = (p: P) => (
  <Brand {...p}>
    <path d="M13.5 21v-7h2.3l.4-2.75h-2.7V9.45c0-.8.22-1.34 1.36-1.34h1.45V5.66c-.25-.03-1.11-.11-2.12-.11-2.1 0-3.54 1.28-3.54 3.64v2.06H8.4V14h2.25v7z" />
  </Brand>
);

export const LinkedInIcon = (p: P) => (
  <Brand {...p}>
    <path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0M3.32 21.2h3.28V8.52H3.32zM9.14 8.52h3.14v1.73h.05c.44-.83 1.5-1.7 3.1-1.7 3.32 0 3.93 2.18 3.93 5.02v6.63h-3.28v-5.88c0-1.4-.03-3.2-1.95-3.2-1.96 0-2.26 1.53-2.26 3.1v5.98H9.14z" />
  </Brand>
);

export const WhatsAppIcon = (p: P) => (
  <Brand {...p}>
    <path d="M12 2a10 10 0 0 0-8.6 15.05L2.05 22l5.05-1.32A10 10 0 1 0 12 2m0 1.8a8.2 8.2 0 0 1 5.8 14 8.2 8.2 0 0 1-9.9 1.3l-.35-.2-2.86.75.77-2.78-.23-.36A8.2 8.2 0 0 1 12 3.8m-2.9 3.7c-.14 0-.36.05-.55.26-.19.2-.72.7-.72 1.72s.74 2 .84 2.14c.1.14 1.44 2.28 3.54 3.1 1.75.68 2.1.55 2.48.5.38-.03 1.23-.5 1.4-.99.18-.48.18-.9.13-.98-.05-.09-.19-.14-.4-.24s-1.23-.6-1.42-.67c-.19-.07-.33-.1-.47.1-.14.21-.54.67-.66.81-.12.14-.24.16-.45.05-.21-.1-.88-.32-1.68-1.03-.62-.55-1.04-1.23-1.16-1.44-.12-.2-.01-.31.09-.42.09-.09.21-.24.31-.36.1-.12.13-.2.2-.34.07-.14.03-.26-.02-.36-.05-.1-.46-1.12-.63-1.53-.16-.4-.33-.34-.46-.35z" />
  </Brand>
);
