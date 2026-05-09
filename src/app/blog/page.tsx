import type { Metadata } from 'next';

import { FilteredPosts } from '@/components/blog/filtered-posts';
import { BlogTagChips } from '@/components/blog/tag-chips';
import { BlogListJsonLd } from '@/components/seo/blog-list-jsonld';
import { H1, Lead } from '@/components/typography';
import { getAllPostMetas, getAllTags } from '@/lib/data/blog';
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
 * `getAllPostMetas` in production. The empty state covers the moment
 * before the first published post lands.
 *
 * Drafts visible in `pnpm dev`: when `NODE_ENV !== 'production'` we
 * include drafts so the author can preview them on the list without
 * having to type the slug. The card itself flags them with a `DRAFT`
 * pill (see `<BlogCard>`). Sitemap, RSS, and JSON-LD always exclude
 * drafts regardless of environment so previews never leak.
 *
 * Server-side splits the data into a JSON-serialisable snapshot, then
 * hands it to client components for the tag-filter UX (`useBlogFilter`
 * + `<BlogTagChips>` + `<FilteredPosts>`). Same architecture as
 * `/projects`.
 */
export default function BlogPage() {
  const includeDrafts = process.env.NODE_ENV !== 'production';
  const posts = getAllPostMetas({ includeDrafts });
  const tags = getAllTags();

  return (
    <section className="mx-auto mt-8 w-full max-w-3xl px-4 pb-16 sm:px-8">
      <BlogListJsonLd />
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
        <div className="flex flex-col gap-8">
          <BlogTagChips tags={tags} totalPosts={posts.length} />
          <FilteredPosts posts={posts} />
        </div>
      )}
    </section>
  );
}
