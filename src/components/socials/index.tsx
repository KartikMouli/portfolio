import { SiLeetcode } from 'react-icons/si';
import { FaXTwitter } from 'react-icons/fa6';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

const socialLinks = [
  {
    href: siteConfig.links.linkedin,
    icon: <FaLinkedin className="w-4 h-4" />,
    label: 'LinkedIn',
  },
  {
    href: siteConfig.links.github,
    icon: <FaGithub className="w-4 h-4" />,
    label: 'GitHub',
  },
  {
    href: `mailto:${siteConfig.author.email}`,
    icon: <Mail className="w-4 h-4" />,
    label: 'Email',
  },
  {
    href: siteConfig.links.twitter,
    icon: <FaXTwitter className="w-4 h-4" />,
    label: 'X',
  },
  {
    href: siteConfig.links.leetcode,
    icon: <SiLeetcode className="w-4 h-4" />,
    label: 'LeetCode',
  },
];

export default function Socials() {
  return (
    <section className="flex justify-center gap-3">
      {socialLinks.map(({ href, icon, label }) => {
        const isExternal = !href.startsWith('mailto:');
        return (
          <Link
            key={label}
            href={href}
            // mailto: should hand off to the OS mail client in the same
            // tab; only force a new tab for external profiles.
            {...(isExternal && {
              target: '_blank',
              rel: 'noopener noreferrer',
            })}
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full',
              'bg-transparent hover:bg-accent/50',
              'border border-border/50 hover:border-border',
              'hover:text-foreground hover:cursor-pointer'
            )}
            title={label}
            aria-label={label}
          >
            {icon}
          </Link>
        );
      })}
    </section>
  );
}
