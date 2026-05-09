import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import Socials from '../socials';
import { siteConfig } from '@/config/site';

// Cacheable use case for `cacheComponents` — year is read once when the
// cache entry is created (build / revalidate) instead of being recomputed
// on every render. Pattern from
// https://nextjs.org/docs/messages/next-prerender-current-time
async function getCopyrightYear() {
  'use cache';
  return new Date().getFullYear();
}

/**
 * Short build SHA, surfaced in the footer for transparency / debugging.
 * Reads `VERCEL_GIT_COMMIT_SHA` (set automatically on Vercel deploys); on
 * local dev it returns `null` and the chip simply doesn't render.
 */
async function getBuildSha(): Promise<string | null> {
  'use cache';
  const sha = process.env.VERCEL_GIT_COMMIT_SHA;
  return sha ? sha.slice(0, 7) : null;
}

export default async function Footer() {
  const [year, sha] = await Promise.all([getCopyrightYear(), getBuildSha()]);
  const repoUrl = `${siteConfig.links.github}/portfolio`;

  return (
    <footer className="border-t border-border/40 mt-12">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-6 px-8 py-8 sm:flex-row-reverse sm:justify-between">
        <Socials />

        <section className="flex flex-col items-center gap-2 text-sm text-muted-foreground sm:items-start">
          {/* Row 1: copyright + privacy */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span>&copy; {year}</span>
            <Link className="hover:text-foreground" href="/">
              {siteConfig.name}
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link className="hover:text-foreground" href="/privacy">
              Privacy Policy
            </Link>
          </div>

          {/* Row 2: machine-readable resources. `feed.xml` leads
              because it's the most user-actionable of the four — humans
              subscribe to RSS, no one subscribes to a sitemap. The
              other three are crawler-facing and live further right. */}
          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-xs">
            <Link
              className="hover:text-foreground"
              href="/feed.xml"
              title="RSS feed for the blog"
            >
              feed.xml
            </Link>
            <Separator orientation="vertical" className="h-3" />
            <Link
              className="hover:text-foreground"
              href="/sitemap.xml"
              title="XML sitemap for search engines"
            >
              sitemap.xml
            </Link>
            <Separator orientation="vertical" className="h-3" />
            <Link
              className="hover:text-foreground"
              href="/robots.txt"
              title="Crawler directives"
            >
              robots.txt
            </Link>
            <Separator orientation="vertical" className="h-3" />
            <Link
              className="hover:text-foreground"
              href="/llms.txt"
              title="Markdown index for LLM crawlers (llmstxt.org spec)"
            >
              llms.txt
            </Link>
            {sha && (
              <>
                <Separator orientation="vertical" className="h-3" />
                <Link
                  className="hover:text-foreground"
                  href={`${repoUrl}/commit/${sha}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Currently deployed commit"
                >
                  build {sha}
                </Link>
              </>
            )}
          </div>
        </section>
      </div>
    </footer>
  );
}
