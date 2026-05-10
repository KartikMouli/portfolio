import type { Metadata } from 'next';
import Link from 'next/link';
import { format } from 'date-fns';

import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-jsonld';
import { H1, H2, List, Muted, P } from '@/components/typography';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

/**
 * `/keys` — keyboard shortcuts + discoverable URLs.
 *
 * Source-of-truth for the actual shortcut bindings is
 * `src/components/command-menu.tsx`. Keep this page in sync when
 * adding/removing shortcuts there.
 */
const LAST_UPDATED = '2026-05-08'; // ISO yyyy-mm-dd

export const metadata: Metadata = {
  title: 'Keys',
  description: `Keyboard shortcuts and discoverable URLs on ${siteConfig.author.name}'s site.`,
  alternates: { canonical: `${siteConfig.url}/keys` },
};

const linkCls =
  'font-semibold underline underline-offset-4 hover:text-muted-foreground';

/**
 * Inline `<kbd>` styling, mirroring the navbar's command-menu trigger
 * pill so the visual language is consistent across the site.
 */
function Kbd({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center gap-0.5 rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground',
        className
      )}
    >
      {children}
    </kbd>
  );
}

export default function KeysPage() {
  const updated = format(new Date(LAST_UPDATED), 'MMMM d, yyyy');

  return (
    <section className="mt-8 pb-16 max-w-3xl mx-auto px-4 sm:px-8">
      <BreadcrumbJsonLd name="Keys" path="/keys" />
      <div className="space-y-4 mb-8">
        <H1>Keys</H1>
        <Muted>Last updated: {updated}</Muted>
      </div>

      <div className="space-y-6">
        <P>
          Keyboard shortcuts and discoverable URLs on this site. The ⌘K palette
          covers everything below — but if you&apos;d rather not click, this
          page documents what each key does.
        </P>

        <H2>Open the command palette</H2>
        <List>
          <li>
            <Kbd>⌘K</Kbd> / <Kbd>Ctrl+K</Kbd> — from anywhere on the site.
          </li>
          <li>
            <Kbd>/</Kbd> — when you&apos;re not typing in an input, textarea, or
            content-editable.
          </li>
        </List>

        <H2>Quick navigation</H2>
        <P>
          Vim-style <Kbd>g</Kbd>-prefix routes — fire when the palette is closed
          and you&apos;re not in a text field. Press <Kbd>g</Kbd>, then within
          ~1 second:
        </P>
        <List>
          <li>
            <Kbd>g</Kbd> <Kbd>h</Kbd> — Home (<code>/</code>)
          </li>
          <li>
            <Kbd>g</Kbd> <Kbd>p</Kbd> — Projects (<code>/projects</code>)
          </li>
          <li>
            <Kbd>g</Kbd> <Kbd>b</Kbd> — Blog (<code>/blog</code>)
          </li>
          <li>
            <Kbd>g</Kbd> <Kbd>c</Kbd> — Contact (<code>/contact</code>)
          </li>
        </List>

        <H2>Accessibility</H2>
        <List>
          <li>
            <Kbd>Tab</Kbd> from a fresh page reveals the &quot;Skip to
            content&quot; link in the top-left, jumping you past the navbar.
          </li>
          <li>
            All focusable elements have visible focus rings — keyboard nav is a
            first-class path.
          </li>
        </List>

        <H2>Discoverable URLs</H2>
        <P>
          A handful of pages don&apos;t appear in the main nav — type or paste
          them.
        </P>
        <List>
          <li>
            <Link href="/now" className={linkCls}>
              /now
            </Link>{' '}
            — what I&apos;m focused on right now.
          </li>
          <li>
            <Link href="/uses" className={linkCls}>
              /uses
            </Link>{' '}
            — gear and software I use day-to-day.
          </li>
          <li>
            <Link href="/keys" className={linkCls}>
              /keys
            </Link>{' '}
            — this page.
          </li>
          <li>
            <Link href="/llms.txt" className={linkCls}>
              /llms.txt
            </Link>{' '}
            — AI-readable site overview.
          </li>
        </List>
      </div>
    </section>
  );
}
