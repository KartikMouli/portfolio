import { siteConfig } from '@/config/site';
import type { BlogFrontmatter } from '@/lib/schemas';

interface Props {
  meta: BlogFrontmatter;
  /** Computed by `getPostMeta` from the MDX prose body — passed in
   *  rather than recomputed here so we don't re-read the file. Used to
   *  populate `BlogPosting.wordCount`, a quality signal Google reads. */
  wordCount?: number;
  /** Plain-text article body (MDX scaffolding stripped) for
   *  `BlogPosting.articleBody`. AI search engines (ChatGPT, Perplexity,
   *  Gemini grounding, Bing Copilot) read JSON-LD; a populated body
   *  field gives them grounded prose to cite instead of guessing from
   *  headings. The caller is responsible for stripping — see
   *  `mdxToPlainText` in `lib/data/mdx-text.ts`. Capped to keep the
   *  emitted HTML payload reasonable on long posts. */
  articleBody?: string;
}

/**
 * Structured data for `/blog/[slug]`. Two schemas:
 *
 *   - `BlogPosting` — the post, with `headline`, `datePublished`,
 *     `keywords` (the tags), and `mainEntityOfPage` pointing at this
 *     URL. Drives the "Article" rich result when the post ranks.
 *     Uses `BlogPosting` (not generic `Article`) so Google connects
 *     it to the parent `/blog` collection more clearly.
 *   - `BreadcrumbList` — `Home → Writing → <Title>`. Google uses
 *     this for the URL crumbs in the SERP listing.
 *
 * Image is the per-post OG card (Next emits one PNG at
 * `/<route>/opengraph-image.png` when an `opengraph-image.tsx` exists
 * in that segment). If the post declares a `coverImage` in
 * frontmatter, that takes precedence.
 *
 * The site-wide `Person` + `WebSite` schemas are still emitted from
 * the layout's `<JsonLd />`, so this component only adds what's
 * page-specific.
 *
 * No schema is emitted for drafts — they 404 in production anyway.
 */
export function BlogJsonLd({ meta, wordCount, articleBody }: Props) {
  if (meta.draft) return null;

  const pageUrl = `${siteConfig.url}/blog/${meta.slug}`;
  const ogImage = meta.coverImage ?? `${pageUrl}/opengraph-image.png`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: meta.title,
    description: meta.summary,
    image: ogImage,
    datePublished: meta.publishedAt,
    // `dateModified` falls back to `publishedAt` when no `updatedAt`
    // is set. Google uses the gap between the two to detect fresh
    // content; collapsing them when nothing changed is correct, and
    // surfacing a real later date when the post is rewritten signals
    // that the page is worth re-crawling.
    dateModified: meta.updatedAt ?? meta.publishedAt,
    keywords: meta.tags.join(', '),
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    // Quality signal for Google's article ranking — surfaces only when
    // available (caller can omit on lookup failure).
    ...(typeof wordCount === 'number' && wordCount > 0 ? { wordCount } : {}),
    // Grounded prose for AI engines. Omitted when empty so we don't
    // ship a meaningless field on routes where extraction failed.
    ...(articleBody ? { articleBody } : {}),
    // For posts cross-published elsewhere (the rare guest-post case),
    // surface the canonical URL so Google understands the relationship.
    ...(meta.canonicalUrl && meta.canonicalUrl !== pageUrl
      ? { sameAs: meta.canonicalUrl }
      : {}),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Writing',
        item: `${siteConfig.url}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: meta.title,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
