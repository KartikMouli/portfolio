import type { Metadata } from 'next';
import { ArrowUpRight, Construction, Github } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
      {/* Sends visitors somewhere alive in the meantime — the GitHub
          profile README is the closest thing to a "what I'm doing now"
          surface until the blog ships. `asChild` lets the anchor inherit
          Button styling without breaking the right-click / open-in-tab
          affordance. */}
      <Button asChild className="mt-2">
        <a href={siteConfig.links.github} target="_blank" rel="noopener">
          <Github className="size-4" />
          Read my GitHub
          <ArrowUpRight className="size-4" />
        </a>
      </Button>
    </section>
  );
}
