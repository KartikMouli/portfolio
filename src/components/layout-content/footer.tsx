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

export default async function Footer() {
  const year = await getCopyrightYear();

  return (
    <footer className="border-t border-border/40 mt-12">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-8 py-8 sm:flex-row-reverse sm:justify-between">
        <div className="mb-6 sm:mb-0">
          <Socials />
        </div>

        <section className="flex flex-col items-center sm:items-start gap-3 text-sm text-muted-foreground/80">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span>&copy; {year} </span>
            <span>
              <Link className="hover:text-foreground" href="/">
                {siteConfig.name}
              </Link>
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span>
              <Link
                className="hover:text-foreground hover:cursor-pointer"
                href="/privacy"
              >
                Privacy Policy
              </Link>
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span>
              <Link
                className="font-mono hover:text-foreground hover:cursor-pointer"
                href="/llms.txt"
                title="Markdown index for LLM crawlers (llmstxt.org spec)"
              >
                llms.txt
              </Link>
            </span>
          </div>
        </section>
      </div>
    </footer>
  );
}
