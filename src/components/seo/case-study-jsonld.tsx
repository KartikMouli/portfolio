import { siteConfig } from '@/config/site';
import type { CaseStudyFrontmatter } from '@/lib/schemas';

interface Props {
  meta: CaseStudyFrontmatter;
  /** Plain-text body for `Article.articleBody`. Lets AI search engines
   *  (ChatGPT, Perplexity, Gemini grounding, Bing Copilot) cite the
   *  case study with grounded prose rather than scraping rendered HTML.
   *  Caller strips MDX scaffolding via `mdxToPlainText`. */
  articleBody?: string;
}

/**
 * Structured data for `/projects/[slug]` case-study pages. Three schemas:
 *
 *   - `Article` — the case study itself, with author, datePublished,
 *     and `mainEntityOfPage` pointing at this URL. Drives the "Article"
 *     rich result when the page ranks.
 *   - `BreadcrumbList` — `Home → Projects → <Title>`. Google uses this
 *     for the URL crumbs in the SERP listing.
 *
 * Image is the per-case-study OG card (Next 16 emits one PNG at
 * `/<route>/opengraph-image.png` when an `opengraph-image.tsx` exists
 * in that segment). If the case study declares an explicit `heroImage`
 * in frontmatter, that takes precedence.
 *
 * The site-wide `Person` + `WebSite` schemas are still emitted from
 * the layout's `<JsonLd />`, so this component only adds what's
 * page-specific.
 */
export function CaseStudyJsonLd({ meta, articleBody }: Props) {
  const pageUrl = `${siteConfig.url}/projects/${meta.slug}`;
  const ogImage = meta.heroImage ?? `${pageUrl}/opengraph-image.png`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.title,
    description: meta.summary,
    image: ogImage,
    datePublished: meta.publishedAt,
    dateModified: meta.publishedAt,
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
    about: {
      '@type': 'CreativeWork',
      name: meta.projectName,
    },
    // Grounded prose for AI engines. Omitted when empty so we don't
    // ship a meaningless field if the source read failed.
    ...(articleBody ? { articleBody } : {}),
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
        name: 'Projects',
        item: `${siteConfig.url}/projects`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: meta.projectName,
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
