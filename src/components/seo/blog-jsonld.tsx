import { siteConfig } from '@/config/site';
import type { BlogFrontmatter } from '@/lib/schemas';

interface Props {
  meta: BlogFrontmatter;
  /** Computed by `getPostMeta` from the MDX prose body — passed in
   *  rather than recomputed here so we don't re-read the file. Used to
   *  populate `BlogPosting.wordCount`, a quality signal Google reads. */
  wordCount?: number;
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
export function BlogJsonLd({ meta, wordCount }: Props) {
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
    dateModified: meta.publishedAt,
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
