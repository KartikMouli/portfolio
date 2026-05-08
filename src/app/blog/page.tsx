import type { Metadata } from 'next';
import { Construction } from 'lucide-react';
import { H1 } from '@/components/typography';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Blog',
  description: `Writing from ${siteConfig.author.name} — coming soon.`,
  robots: {
    // Don't index a placeholder.
    index: false,
    follow: true,
  },
};

export default function BlogPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl border border-muted-foreground/15 bg-muted text-muted-foreground">
        <Construction className="size-6" />
      </span>
      <H1 className="text-3xl">Work in progress</H1>
      <p className="max-w-md text-sm text-muted-foreground">
        The blog is being built. Notes on the things I&apos;m learning, the
        tools I love, and the systems I&apos;m shipping will land here soon.
      </p>
    </section>
  );
}
