import type { Metadata } from 'next';
import Link from 'next/link';
import { format } from 'date-fns';

import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-jsonld';
import { H1, H2, List, Muted, P } from '@/components/typography';
import { siteConfig } from '@/config/site';

/**
 * `/now` — what I'm focused on right now.
 *
 * Inspired by /now pages (https://nownownow.com/about). The convention:
 * a single short page that reflects *current* focus, refreshed every
 * few weeks. Bump `LAST_UPDATED` whenever you edit the prose below.
 */
const LAST_UPDATED = '2026-05-08'; // ISO yyyy-mm-dd; bump when content changes

export const metadata: Metadata = {
  title: 'Now',
  // Sharper than "what X is focused on" — names the three concrete
  // things the page actually contains so the SERP snippet reads as a
  // promise of value rather than a label.
  description: `A live snapshot of what ${siteConfig.author.name} is shipping, learning, and saying no to — refreshed when focus shifts.`,
  alternates: { canonical: `${siteConfig.url}/now` },
};

const linkCls =
  'font-semibold underline underline-offset-4 hover:text-muted-foreground';

export default function NowPage() {
  const updated = format(new Date(LAST_UPDATED), 'MMMM d, yyyy');

  return (
    <section className="mt-8 pb-16 max-w-3xl mx-auto px-4 sm:px-8">
      <BreadcrumbJsonLd name="Now" path="/now" />
      <div className="space-y-4 mb-8">
        <H1>Now</H1>
        <Muted>Last updated: {updated}</Muted>
      </div>

      <div className="space-y-6">
        <P>
          A snapshot of where my attention is. Inspired by{' '}
          <Link
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className={linkCls}
          >
            /now pages
          </Link>
          . Refreshed whenever my focus shifts meaningfully.
        </P>

        <H2>Work</H2>
        <P>
          Building{' '}
          <Link
            href="https://digiquickai.com"
            target="_blank"
            rel="noopener noreferrer"
            className={linkCls}
          >
            DigiQuick AI
          </Link>{' '}
          — an AI-powered digital-product builder that turns simple prompts into
          market-validated, ready-to-sell ebooks, planners, templates, and web
          apps. Shipping it at{' '}
          <Link
            href={siteConfig.currentRole.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkCls}
          >
            {siteConfig.currentRole.company}
          </Link>{' '}
          for a client.
        </P>

        <H2>This portfolio</H2>
        <P>Just shipped a top-to-bottom revamp. Three headline pieces:</P>
        <List>
          <li>
            New warm-cream design system + chanhdai-style hero + terminal-themed
            brand identity (<code>&gt;km_</code> favicon, OG card, navbar mark).
          </li>
          <li>
            Gemini 2.5 Flash chatbot via{' '}
            <Link
              href="https://www.assistant-ui.com"
              target="_blank"
              rel="noopener noreferrer"
              className={linkCls}
            >
              assistant-ui
            </Link>{' '}
            — same-origin guarded, mobile-responsive, with a pre-first-token
            shimmer.
          </li>
          <li>
            New Open Source contributions section, three new projects with a
            serif-monogram fallback for cards without screenshots, and an a11y
            pass (skip-to-content, focus rings, reduced-motion respect).
          </li>
        </List>

        <H2>Switched</H2>
        <P>
          Moved my main dev box from Windows to Ubuntu. Windows was lagging hard
          on <code>pnpm dev</code> and build cycles, and the friction had become
          unignorable. The Linux experience has been smoother out of the gate —
          fewer surprises, faster everything.
        </P>

        <H2>Not now</H2>
        <P>
          Side-project sprawl. Anything that needs more than a weekend without a
          clear payoff. Saying no is a feature.
        </P>
      </div>
    </section>
  );
}
