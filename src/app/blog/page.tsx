import type { Metadata } from 'next';

import { BlogCard } from '@/components/blog/blog-card';
import { H1, Lead } from '@/components/typography';
import { getAllPostMetas } from '@/lib/data/blog';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Writing',
  description: `Notes from ${siteConfig.author.name} — what I'm shipping, what broke, what was worth it.`,
  alternates: { canonical: `${siteConfig.url}/blog` },
  openGraph: {
    title: `Writing | ${siteConfig.author.name}`,
    description: `Notes from ${siteConfig.author.name} — what I'm shipping, what broke, what was worth it.`,
    type: 'website',
    url: `${siteConfig.url}/blog`,
  },
};

/**
 * `/blog` — list of writing, newest-first. Drafts are filtered out by
 * `getAllPostMetas` by default. The empty state covers the moment
 * before the first published post lands.
 */
export default function BlogPage() {
  const posts = getAllPostMetas();

  return (
    <section className="mx-auto mt-8 w-full max-w-3xl px-4 pb-16 sm:px-8">
      <header className="mb-10 space-y-3">
        <H1>Writing</H1>
        <Lead className="max-w-xl text-base">
          Short posts on what I&apos;m shipping at work and on side projects —
          the bug that took two days, the choice between two tools, and the
          stuff I wish I&apos;d known sooner.
        </Lead>
      </header>

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nothing published yet — the first post is on its way.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
