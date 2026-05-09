'use client';

import { useMemo } from 'react';

import { BlogCard } from '@/components/blog/blog-card';
import type { PostMeta } from '@/lib/data/blog';
import { useBlogFilter } from '@/lib/store/blog-filter';

interface FilteredPostsProps {
  /** All published posts (drafts already filtered out server-side),
   *  sorted newest-first. */
  posts: PostMeta[];
}

/**
 * `/blog` page list. Reads the selected tag from the zustand store and
 * filters the server-rendered post snapshot in-memory. Mirrors the
 * projects-page pattern — same UX (empty state when zero matches,
 * hint with the tag name).
 */
export function FilteredPosts({ posts }: FilteredPostsProps) {
  const selected = useBlogFilter((s) => s.selectedTag);

  const filtered = useMemo(() => {
    if (!selected) return posts;
    return posts.filter((p) => p.tags.includes(selected));
  }, [posts, selected]);

  if (filtered.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-muted-foreground/30 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No posts tagged{' '}
          <span className="font-mono text-foreground">{selected}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {filtered.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
