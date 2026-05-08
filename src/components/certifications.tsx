import Link from 'next/link';
import type { ReactElement } from 'react';
import { ArrowUpRight, Award } from 'lucide-react';
import { H2 } from '@/components/typography';
import { getCertifications } from '@/lib/data/certifications';

/**
 * Certifications grid for the home page — modeled on chanhdai.com's
 * card layout: small icon box, title, "@issuer | date" subtitle, and
 * an arrow indicator on the right.
 *
 * Data lives in `src/data/certifications.json`. Each entry's `icon`
 * field maps to an entry in ICON_MAP below; entries point at brand
 * SVGs in `/public/logos/` so they render as their full-color marks
 * (richer than the simple-icons monochrome glyphs we used before).
 */

// Pre-styled ReactElements keyed by the `icon` string in the data.
// Falls back to a neutral <Award /> for any cert that omits `icon`
// or maps to nothing here.
//
// Plain <img> on purpose — Next/Image blocks SVG sources by default
// (CSP / `dangerouslyAllowSVG`) and offers no optimization upside for
// vector files, so we'd just be eating config noise for nothing.
const ICON_MAP: Record<string, ReactElement> = {
  /* eslint-disable @next/next/no-img-element */
  SiMeta: <img src="/logos/meta.svg" alt="Meta" width={20} height={20} />,
  SiGooglecloud: (
    <img
      src="/logos/google-cloud.svg"
      alt="Google Cloud"
      width={20}
      height={20}
    />
  ),
  /* eslint-enable @next/next/no-img-element */
};

export default function Certifications() {
  const items = getCertifications();
  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <H2 className="border-b-2 pb-3">
        Certifications{' '}
        <span className="text-base font-normal text-muted-foreground">
          ({items.length})
        </span>
      </H2>
      <ul className="flex flex-col gap-2">
        {items.map((cert) => {
          const icon = cert.icon ? ICON_MAP[cert.icon] : undefined;
          return (
            <li key={cert.href}>
              <Link
                href={cert.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-lg border bg-card px-3 py-3 transition-colors hover:border-foreground/40"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-muted-foreground/15 bg-muted text-muted-foreground [&_svg]:size-5">
                  {icon ?? <Award aria-hidden="true" />}
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium text-foreground">
                    {cert.name}
                  </span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="truncate">@{cert.issuer}</span>
                    <span aria-hidden="true">|</span>
                    <span className="font-mono tabular-nums">
                      {cert.issuedAt}
                    </span>
                  </span>
                </div>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
