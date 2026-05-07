import Link from 'next/link';
import { ArrowUpRight, FileDown, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiLeetcode } from 'react-icons/si';
import { siteConfig } from '@/config/site';

/**
 * Card-style social grid used in the home hero. Each card is icon + label
 * with an arrow that animates on hover. Compared to `<Socials />` (the bare
 * icon row still used by /about and the footer), these are bigger, easier
 * to scan, and visually echo chanhdai.com's hero — without copying its
 * dark zinc palette: borders + bg here come from our theme tokens.
 */

type SocialCard = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

const cards: SocialCard[] = [
  {
    href: siteConfig.links.github,
    icon: <FaGithub className="size-5" />,
    label: 'GitHub',
  },
  {
    href: siteConfig.links.linkedin,
    icon: <FaLinkedin className="size-5" />,
    label: 'LinkedIn',
  },
  {
    href: siteConfig.links.twitter,
    icon: <FaXTwitter className="size-5" />,
    label: 'X',
  },
  {
    href: siteConfig.links.leetcode,
    icon: <SiLeetcode className="size-5" />,
    label: 'LeetCode',
  },
  {
    href: `mailto:${siteConfig.author.email}`,
    icon: <Mail className="size-5" />,
    label: 'Email',
  },
  {
    href: siteConfig.links.resume,
    icon: <FileDown className="size-5" />,
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
