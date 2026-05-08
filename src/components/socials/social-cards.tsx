import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, FileDown } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
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
 * Helper: render a multi-color brand logo from `/public/logos/{file}`.
 *
 * `unoptimized` because Next.js Image's optimizer rejects SVGs by default
 * (CSP / `dangerouslyAllowSVG`); with this flag the file is served straight
 * from `/public/logos/...` without going through `/_next/image`, so SVGs
 * render as expected and the lint rule against raw <img> stays satisfied.
 *
 * ONLY use this for multi-color brand SVGs (Gmail, Google Cloud, LinkedIn,
 * Meta, LeetCode); for monochrome marks (GitHub, X) use an inline react-
 * icons component instead, because when an SVG loads via <Image> / <img>
 * the page's CSS `currentColor` doesn't reach inside it and pure-black
 * icons disappear in dark mode.
 */
function Logo({ file, alt }: { file: string; alt: string }) {
  return (
    <Image
      src={`/logos/${file}`}
      alt={alt}
      width={20}
      height={20}
      unoptimized
      className="size-5"
    />
  );
}

const cards: SocialCard[] = [
  {
    href: siteConfig.links.github,
    // Inline SVG via react-icons — inherits text-foreground so the
    // octocat stays visible in both light + dark themes.
    icon: <FaGithub className="size-5" />,
    label: 'GitHub',
  },
  {
    href: siteConfig.links.linkedin,
    icon: <Logo file="linkedin.svg" alt="LinkedIn" />,
    label: 'LinkedIn',
  },
  {
    href: siteConfig.links.twitter,
    // Inline SVG (currentColor) — same dark-mode reason as GitHub.
    icon: <FaXTwitter className="size-5" />,
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
