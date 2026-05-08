import Link from 'next/link';
import { ArrowUpRight, FileDown } from 'lucide-react';
import { siteConfig } from '@/config/site';

/**
 * Card-style social grid used in the home hero. Each card is icon + label
 * with an arrow that animates on hover. Compared to `<Socials />` (the bare
 * icon row still used by the footer), these are bigger, easier to scan,
 * and visually echo chanhdai.com's hero — without copying its dark zinc
 * palette: borders + bg here come from our theme tokens.
 *
 * Icons are real brand SVGs from `/public/logos/` so they render in their
 * full-color marks (richer than monochrome simple-icons glyphs). Resume is
 * the lone exception: it has no brand, so it stays a tinted lucide icon.
 */

type SocialCard = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

/**
 * Helper: render a brand logo from `/public/logos/{file}` at 20×20.
 * Plain <img> on purpose — Next/Image blocks SVG sources by default
 * (CSP / dangerouslyAllowSVG) and offers no optimization upside for
 * vector files, so we'd just be eating config noise for nothing.
 */
function Logo({ file, alt }: { file: string; alt: string }) {
   
  return (
    <img
      src={`/logos/${file}`}
      alt={alt}
      width={20}
      height={20}
      className="size-5"
    />
  );
}

const cards: SocialCard[] = [
  {
    href: siteConfig.links.github,
    icon: <Logo file="github.svg" alt="GitHub" />,
    label: 'GitHub',
  },
  {
    href: siteConfig.links.linkedin,
    icon: <Logo file="linkedin.svg" alt="LinkedIn" />,
    label: 'LinkedIn',
  },
  {
    href: siteConfig.links.twitter,
    icon: <Logo file="x.svg" alt="X" />,
    label: 'X',
  },
  {
    href: siteConfig.links.leetcode,
    icon: <Logo file="leetcode.svg" alt="LeetCode" />,
    label: 'LeetCode',
  },
  {
    href: `mailto:${siteConfig.author.email}`,
    icon: <Logo file="gmail.svg" alt="Gmail" />,
    label: 'Email',
  },
  {
    href: siteConfig.links.resume,
    // No public brand for "Resume" — keep a tinted lucide glyph.
    icon: <FileDown className="size-5 text-[#A65A2E]" />,
    label: 'Resume',
  },
];

export default function SocialCards() {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {cards.map((card) => {
        const isExternal = !card.href.startsWith('mailto:');
        return (
          <li key={card.label}>
            <Link
              href={card.href}
              {...(isExternal && {
                target: '_blank',
                rel: 'noopener noreferrer',
              })}
              className="group flex items-center justify-between rounded-md border bg-card px-4 py-3 text-sm transition-colors hover:border-foreground/40"
              aria-label={card.label}
            >
              <span className="flex items-center gap-3">
                {card.icon}
                <span className="font-medium">{card.label}</span>
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
