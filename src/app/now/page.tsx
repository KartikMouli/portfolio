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
const LAST_UPDATED = '2026-07-19'; // ISO yyyy-mm-dd; bump when content changes

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
          Building <strong>iDelta MS</strong> — the investor-facing portal for{' '}
          <Link
            href="https://www.stellaredgebrokers.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkCls}
          >
            StellarEdge Brokers
          </Link>
          &apos; brokerage platform. It sits on top of the accounting and IAM
          services already running there, so most of the work is deciding what
          an investor should see of a system built for brokers — and shaping the
          APIs to match.
        </P>
        <P>
          Just handed off{' '}
          <Link
            href="https://digiquickai.com"
            target="_blank"
            rel="noopener noreferrer"
            className={linkCls}
          >
            DigiQuick AI
          </Link>{' '}
          — the AI digital-product builder I&apos;d been leading — to the
          client. Both shipped at{' '}
          <Link
            href={siteConfig.currentRole.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkCls}
          >
            {siteConfig.currentRole.company}
          </Link>
          .
        </P>

        <H2>This portfolio</H2>
        <P>
          Finally pulled the production work onto it. The site had been showing
          side projects while the things I actually spend my days on stayed
          invisible.
        </P>
        <List>
          <li>
            Added DigiQuick, iDelta and Converzoy as first-class entries, and
            wrote a case study for each — the precompute engine I built and then
            deleted, printing HTML the model wrote, and what it takes to survive
            inside someone else&apos;s website.
          </li>
          <li>
            Each case study ends with what I&apos;d do differently, which is the
            part I&apos;d want to read.
          </li>
        </List>

        <H2>Switched back</H2>
        <P>
          Moved my main dev box to Ubuntu earlier this year, chasing faster{' '}
          <code>pnpm dev</code> and build cycles. Builds genuinely were quicker.
          Everything else wasn&apos;t: the laptop ran hot enough to be
          unpleasant, the fingerprint reader never worked, and the screen froze
          often enough that I stopped trusting it.
        </P>
        <P>
          So I&apos;m back on Windows. Faster builds are worth a lot, but not a
          machine I have to think about — the hardware doing what it&apos;s
          supposed to turned out to be the thing I was actually optimising for.
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
