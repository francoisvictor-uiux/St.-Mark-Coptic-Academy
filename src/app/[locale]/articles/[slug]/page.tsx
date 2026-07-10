import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  formatDate,
  getArticleBySlug,
  queryArticles,
  pickLang,
  type ArticleCard as ArticleCardData,
} from "@/lib/public-content";
import { annotateArticleBody } from "@/lib/article-toc";
import ArticleCard from "@/components/articles/ArticleCard";
import { ClockIcon } from "@/components/articles/icons";
import ReadingProgress from "@/components/articles/reader/ReadingProgress";
import ArticleToc from "@/components/articles/reader/ArticleToc";
import ArticleBody from "@/components/articles/reader/ArticleBody";
import CoverImage from "@/components/articles/reader/CoverImage";
import ArticleActions from "@/components/articles/reader/ArticleActions";
import ShareSection from "@/components/articles/reader/ShareSection";
import NewsletterSignup from "@/components/articles/reader/NewsletterSignup";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  const title = pickLang(locale, article.title_ar, article.title_en);
  const description = pickLang(locale, article.excerpt_ar, article.excerpt_en);
  const images = article.cover ? [{ url: article.cover.url }] : undefined;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.published_at ?? undefined,
      images,
    },
    twitter: { card: "summary_large_image", title, description, images: images?.map((i) => i.url) },
  };
}

async function getRelated(categorySlug: string | undefined, excludeSlug: string): Promise<ArticleCardData[]> {
  const out: ArticleCardData[] = [];
  const seen = new Set<string>([excludeSlug]);
  const push = (list: ArticleCardData[]) => {
    for (const a of list) {
      if (seen.has(a.slug)) continue;
      seen.add(a.slug);
      out.push(a);
      if (out.length >= 3) break;
    }
  };
  if (categorySlug) push((await queryArticles({ category: categorySlug, page_size: 4 })).results);
  if (out.length < 3) push((await queryArticles({ sort: "newest", page_size: 4 })).results);
  return out.slice(0, 3);
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("articleReader");
  const ta = await getTranslations("articles");
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const title = pickLang(locale, article.title_ar, article.title_en);
  const dek = pickLang(locale, article.excerpt_ar, article.excerpt_en);
  const category = article.category
    ? pickLang(locale, article.category.name_ar, article.category.name_en)
    : null;

  const rawBody = locale === "en" && article.body_en ? article.body_en : article.body_ar;
  const bodyDir = locale === "en" && article.body_en ? "ltr" : "rtl";
  const { html, headings } = annotateArticleBody(rawBody);
  const hasToc = headings.length >= 3;

  const related = await getRelated(article.category?.slug, slug);
  const authorInitial = (article.author_label || "✢").slice(0, 1);

  return (
    <>
      <Header />
      <ReadingProgress minutes={article.reading_minutes} />

      <main className="pb-4 pt-24 md:pt-28">
        <div className="mx-auto flex max-w-[1180px] justify-center gap-10 px-4 md:px-8">
          {/* Leading gutter: sticky TOC (desktop) */}
          <div className="hidden w-[230px] shrink-0 xl:block">
            {hasToc ? <ArticleToc headings={headings} variant="desktop" /> : null}
          </div>

          {/* Reading column */}
          <div className="w-full max-w-[720px]">
            <Link
              href="/articles"
              className="no-print inline-flex items-center gap-1.5 font-sans text-[13.5px] font-bold text-brown-400 transition-colors hover:text-brown-900"
            >
              <span aria-hidden>←</span> {t("back")}
            </Link>

            {/* ─── Hero ─── */}
            <header className="mt-6">
              {category ? (
                <span className="inline-block w-fit rounded-full bg-brown-500/10 px-3.5 py-1 font-sans text-[12.5px] font-bold text-brown-500">
                  {category}
                </span>
              ) : null}
              <h1 className="mt-4 text-balance font-display text-[32px] font-bold leading-[1.28] text-brown-900 md:text-[42px]">
                {title}
              </h1>
              {dek ? (
                <p className="mt-4 text-pretty font-serif text-[19px] font-light leading-[1.7] text-brown-400 md:text-[21px]">
                  {dek}
                </p>
              ) : null}

              {/* Byline + meta */}
              <div className="mt-6 flex flex-wrap items-center gap-x-3.5 gap-y-2 border-y border-line py-4">
                <span
                  aria-hidden
                  className="flex size-11 items-center justify-center rounded-full bg-creamy-400 font-display text-[17px] font-bold text-brown-500"
                >
                  {authorInitial}
                </span>
                <div className="me-auto">
                  {article.author_label ? (
                    <p className="font-sans text-[14px] font-bold text-brown-900">{article.author_label}</p>
                  ) : null}
                  <p className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 font-sans text-[12.5px] text-brown-300">
                    <span>{formatDate(locale, article.published_at)}</span>
                    <span aria-hidden>·</span>
                    <span className="inline-flex items-center gap-1" dir="ltr">
                      <ClockIcon className="size-[14px]" />
                      {ta("readingTime", { minutes: article.reading_minutes })}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <ArticleActions slug={slug} title={title} />
              </div>
            </header>

            {/* ─── Featured cover ─── */}
            {article.cover ? (
              <figure className="mt-8">
                <CoverImage src={article.cover.url} alt={pickLang(locale, article.cover.alt_ar, article.cover.alt_en)} />
              </figure>
            ) : null}

            {/* ─── Mobile TOC ─── */}
            {hasToc ? (
              <div className="mt-10">
                <ArticleToc headings={headings} variant="mobile" />
              </div>
            ) : null}

            {/* ─── Body ─── */}
            <div className="article-reading mt-10">
              <ArticleBody html={html} dir={bodyDir} />
            </div>

            {/* ─── Author ─── */}
            {article.author_label ? (
              <section
                aria-labelledby="author-heading"
                className="my-14 rounded-[24px] border border-line bg-card p-7 md:p-8"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <span
                    aria-hidden
                    className="flex size-16 shrink-0 items-center justify-center rounded-full bg-creamy-400 font-display text-[24px] font-bold text-brown-500"
                  >
                    {authorInitial}
                  </span>
                  <div className="flex-1">
                    <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brown-300">
                      {t("aboutAuthor")}
                    </p>
                    <h2 id="author-heading" className="mt-1 font-display text-[22px] font-bold text-brown-900">
                      {article.author_label}
                    </h2>
                    <p className="mt-1 font-serif text-[14.5px] text-brown-400">{t("authorRole")}</p>
                  </div>
                  <Link
                    href="/articles"
                    className="no-print inline-flex h-11 w-fit items-center justify-center rounded-full bg-brown-500 px-6 font-sans text-[13.5px] font-bold text-creamy-100 transition-colors hover:bg-brown-600"
                  >
                    {t("viewAuthor")}
                  </Link>
                </div>
              </section>
            ) : null}

            {/* ─── Share ─── */}
            <ShareSection slug={slug} title={title} />

            {/* ─── Related ─── */}
            {related.length > 0 ? (
              <section aria-labelledby="related-heading" className="no-print my-14">
                <h2 id="related-heading" className="mb-6 font-display text-[22px] font-bold text-brown-900">
                  {t("relatedTitle")}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((a) => (
                    <ArticleCard key={a.slug} article={a} />
                  ))}
                </div>
              </section>
            ) : null}

            {/* ─── Newsletter ─── */}
            <NewsletterSignup />
          </div>

          {/* Trailing gutter: balances the reading column optically */}
          <div className="hidden w-[230px] shrink-0 xl:block" aria-hidden />
        </div>
      </main>
      <Footer />
    </>
  );
}
