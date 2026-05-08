import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';
import { getCaseStudyMetas } from '@/lib/data/case-studies';

/**
 * Sitemap. Lists every public route Google should crawl, plus a hint at
 * how often each is likely to change so the crawl budget is spent on
 * the right pages. Three buckets:
 *
 *   - **Static pages** (`/`, `/now`, `/uses`, `/keys`, `/projects`,
 *     `/contact`, `/privacy`) — always present, hand-curated cadence.
 *   - **Case studies** (`/projects/[slug]`) — derived from the MDX
 *     filesystem so adding a new file under `src/content/case-studies/`
 *     auto-extends the sitemap on next build.
 *   - **Excluded**: `/blog` (`robots: { index: false }` placeholder
 *     until the blog ships) and `/llms.txt` (machine-readable, doesn't
 *     belong in human-search index).
 *
 * `lastModified` for case studies uses each file's `publishedAt`
 * frontmatter; everything else uses build time. Bumping a case study
 * is a republish (`new Date()`'d via Vercel deploy regardless).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const buildTime = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: buildTime,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: buildTime,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/now`,
      lastModified: buildTime,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/uses`,
      lastModified: buildTime,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/keys`,
      lastModified: buildTime,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: buildTime,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: buildTime,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const caseStudies: MetadataRoute.Sitemap = getCaseStudyMetas().map(
    ({ slug, publishedAt }) => ({
      url: `${baseUrl}/projects/${slug}`,
      // `publishedAt` is yyyy-mm-dd; `new Date(...)` parses it at UTC
      // midnight which is fine for a daily-granularity field.
      lastModified: publishedAt ? new Date(publishedAt) : buildTime,
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  );

  return [...staticPages, ...caseStudies];
}
