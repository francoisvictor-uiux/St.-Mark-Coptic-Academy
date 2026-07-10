/**
 * Server-side helper: scans a sanitized article-body HTML string, ensures every
 * H2/H3 has a stable `id`, and returns a flat heading list for the table of
 * contents + reading-progress features. Runs on the server so the TOC is
 * present in the initial HTML (SSR-consistent, no hydration flash).
 */

export type ArticleHeading = { id: string; text: string; level: 2 | 3 };

const ENTITIES: Record<string, string> = {
  "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&nbsp;": " ",
};

function decodeEntities(s: string): string {
  return s.replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g, (m) => ENTITIES[m] ?? m);
}

/** Build a URL-safe slug that keeps Arabic letters/numerals. */
function slugify(text: string, used: Set<string>): string {
  let base = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  if (!base) base = "section";
  let id = base;
  let i = 2;
  while (used.has(id)) id = `${base}-${i++}`;
  used.add(id);
  return id;
}

export function annotateArticleBody(html: string): { html: string; headings: ArticleHeading[] } {
  const used = new Set<string>();
  const headings: ArticleHeading[] = [];

  const out = html.replace(
    /<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_m, lvl: string, attrs: string, inner: string) => {
      const text = decodeEntities(inner.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
      const level = Number(lvl) as 2 | 3;

      const existing = /\bid=["']([^"']+)["']/.exec(attrs);
      let id: string;
      let nextAttrs = attrs;
      if (existing) {
        id = existing[1];
        used.add(id);
      } else {
        id = slugify(text, used);
        nextAttrs = `${attrs} id="${id}"`;
      }

      if (text) headings.push({ id, text, level });
      return `<h${lvl}${nextAttrs}>${inner}</h${lvl}>`;
    },
  );

  return { html: out, headings };
}
