import type { Metadata } from 'next';
import Link from 'next/link';
import { format } from 'date-fns';

import { H1, H2, List, Muted, P } from '@/components/typography';
import { siteConfig } from '@/config/site';

/**
 * `/uses` — gear + software I actually use day-to-day.
 *
 * Inspired by /uses pages (https://uses.tech). Bump `LAST_UPDATED`
 * whenever you swap something out below.
 */
const LAST_UPDATED = '2026-05-08'; // ISO yyyy-mm-dd; bump when content changes

export const metadata: Metadata = {
  title: 'Uses',
  description: `The gear and software ${siteConfig.author.name} uses day-to-day.`,
  alternates: { canonical: `${siteConfig.url}/uses` },
};

const linkCls =
  'font-semibold underline underline-offset-4 hover:text-muted-foreground';

export default function UsesPage() {
  const updated = format(new Date(LAST_UPDATED), 'MMMM d, yyyy');

  return (
    <section className="mt-8 pb-16 max-w-3xl mx-auto px-4 sm:px-8">
      <div className="space-y-4 mb-8">
        <H1>Uses</H1>
        <Muted>Last updated: {updated}</Muted>
      </div>

      <div className="space-y-6">
        <P>
          The gear and software I actually use day-to-day. Inspired by{' '}
          <Link
            href="https://uses.tech"
            target="_blank"
            rel="noopener noreferrer"
            className={linkCls}
          >
            /uses pages
          </Link>
          . I&apos;ll refresh this when something meaningful swaps in or out.
        </P>

        <H2>Hardware</H2>
        <List>
          <li>
            <strong>Laptop</strong> — a 6-year-old HP, 16 GB RAM / 512 GB SSD.
            Still hits its marks for the work I throw at it.
          </li>
          <li>
            <strong>Display</strong> — old LG external monitor for the second
            screen.
          </li>
          <li>
            <strong>Keyboard</strong> — Cosmic Byte Artemis (white).
          </li>
          <li>
            <strong>Mouse</strong> — Logitech G102.
          </li>
          <li>
            <strong>Audio</strong> — OnePlus Buds R2 for calls + music.
          </li>
        </List>

        <H2>OS</H2>
        <List>
          <li>
            <strong>Ubuntu 24.04 LTS</strong> — recently moved over from Windows
            (see{' '}
            <Link href="/now" className={linkCls}>
              /now
            </Link>
            ). Smoother out of the gate; fewer surprises.
          </li>
          <li>
            <strong>GNOME</strong> desktop + GNOME Terminal.
          </li>
          <li>
            <strong>bash</strong> — haven&apos;t bothered with zsh; the defaults
            are fine.
          </li>
        </List>

        <H2>Editor</H2>
        <List>
          <li>
            <strong>VS Code</strong> — the OG, still my daily.
          </li>
          <li>
            <strong>Theme</strong> — Dark (Visual Studio), the C/C++
            extension&apos;s variant.
          </li>
          <li>
            <strong>Extensions I&apos;d struggle without</strong>: Error Lens,
            GitLens, markdownlint, Prettier, Remote SSH, Todo Tree, Auto Rename
            Tag.
          </li>
        </List>

        <H2>Dev tooling</H2>
        <List>
          <li>
            <strong>pnpm</strong> by default; whatever the stack at work needs
            otherwise.
          </li>
          <li>
            <strong>nvm</strong> for Node version juggling.
          </li>
          <li>
            <strong>Docker</strong> for anything containerised.
          </li>
          <li>
            <strong>Beekeeper Studio</strong> when I need a SQL client.
          </li>
          <li>
            <strong>Postman</strong> + Swagger for poking at APIs.
          </li>
        </List>

        <H2>Productivity</H2>
        <List>
          <li>
            <strong>Notion</strong> for notes.
          </li>
          <li>
            <strong>ClickUp</strong> for tasks.
          </li>
          <li>
            <strong>YouTube</strong> for music — videos and all, I&apos;m one of
            those.
          </li>
          <li>Off Instagram right now.</li>
        </List>
      </div>
    </section>
  );
}
