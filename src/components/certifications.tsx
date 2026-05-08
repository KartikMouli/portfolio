import Link from 'next/link';
import { ArrowUpRight, Award } from 'lucide-react';
import { SiMeta, SiGooglecloud } from 'react-icons/si';
import type { IconType } from 'react-icons';
import { H2 } from '@/components/typography';
import { getCertifications } from '@/lib/data/certifications';

/**
 * Certifications grid for the home page — modeled on chanhdai.com's
 * card layout: small icon box, title, "@issuer | date" subtitle, and
 * an arrow indicator on the right.
 *
 * Data lives in `src/data/certifications.json`. Add new entries by
 * picking an icon name from `ICON_MAP` below (or registering a new one);
 * keys map directly to react-icons identifiers, no new deps required.
 */

// Tree-shaking-friendly: only the icons we actually reference are
// imported above and registered here.
const ICON_MAP: Record<string, IconType> = {
  SiMeta,
  SiGooglecloud,
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
          const Icon = cert.icon ? ICON_MAP[cert.icon] : undefined;
          return (
            <li key={cert.href}>
              <Link
                href={cert.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-lg border bg-card px-3 py-3 transition-colors hover:border-foreground/40"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-muted-foreground/15 bg-muted text-muted-foreground [&_svg]:size-5">
                  {Icon ? <Icon /> : <Award aria-hidden="true" />}
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
