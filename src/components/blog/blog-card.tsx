import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { ArrowUpRight } from 'lucide-react';

import type { PostMeta } from '@/lib/data/blog';

/**
 * Single blog post card on the `/blog` list. Title links into the post,
 * meta line shows date · reading time · tags. Kept intentionally
 * monochrome and text-first — the case-study cards already use the
 * image-heavy layout, so the writing list reads differently on
 * purpose.
 */
export function BlogCard({ post }: { post: PostMeta }) {
  const date = format(parseISO(post.publishedAt), 'MMM d, yyyy');

  return (
    <article className="group flex flex-col gap-2 border-b border-border/50 pb-6 last:border-b-0">
      <Link
        href={`/blog/${post.slug}`}
        className="flex items-baseline gap-2 text-base font-semibold leading-snug text-foreground transition-colors hover:text-muted-foreground"
      >
        <span className="underline decoration-transparent decoration-1 underline-offset-4 group-hover:decoration-current">
          {post.title}
        </span>
        <ArrowUpRight
          aria-hidden
          className="size-4 shrink-0 -translate-y-px text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </Link>

      <p className="text-sm text-muted-foreground">{post.summary}</p>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <time dateTime={post.publishedAt}>{date}</time>
        <span aria-hidden>·</span>
        <span>{post.readingTime} min read</span>
        {post.tags.length > 0 && (
          <>
            <span aria-hidden>·</span>
            <ul className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-border/60 bg-muted/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </article>
  );
}
