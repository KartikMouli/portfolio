import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';
import { getAllPostMetas } from '@/lib/data/blog';
import { getCaseStudyMetas } from '@/lib/data/case-studies';

/**
 * Sitemap. Lists every public route Google should crawl, plus a hint at
 * how often each is likely to change so the crawl budget is spent on
 * the right pages. Four buckets:
 *
 *   - **Static pages** (`/`, `/now`, `/uses`, `/keys`, `/projects`,
 *     `/blog`, `/contact`, `/privacy`) — always present, hand-curated
 *     cadence.
 *   - **Case studies** (`/projects/[slug]`) — derived from the MDX
 *     filesystem so adding a new file under `src/content/case-studies/`
 *     auto-extends the sitemap on next build.
 *   - **Blog posts** (`/blog/[slug]`) — same MDX pipeline. Drafts are
 *     filtered out by `getAllPostMetas` so they never leak.
 *   - **Excluded**: `/llms.txt` (machine-readable, doesn't belong in a
 *     human-search index).
 *
 * `lastModified` for case studies and blog posts uses each file's
 * `publishedAt` frontmatter; everything else uses build time.
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
      url: `${baseUrl}/blog`,
      lastModified: buildTime,
      changeFrequency: 'weekly',
      priority: 0.8,
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

  // `getAllPostMetas` excludes drafts by default — drafts must never
  // leak into the sitemap (Google would index them once and cache the
  // 404 when we eventually publish under the real slug).
  const blogPosts: MetadataRoute.Sitemap = getAllPostMetas().map(
    ({ slug, publishedAt }) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: publishedAt ? new Date(publishedAt) : buildTime,
      // Posts get edits/typo-fixes more often than case studies; weekly
      // hint nudges Google to re-crawl when a fix lands.
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  );

  return [...staticPages, ...caseStudies, ...blogPosts];
}
