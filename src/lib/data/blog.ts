import 'server-only';

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import GithubSlugger from 'github-slugger';

/**
 * Filesystem layout: `src/content/blog/<slug>.mdx`. Mirror of the
 * case-studies pipeline — `@next/mdx` compiles each file via
 * `await import(...)` in the page route; this module's job is to:
 *
 *   - enumerate slugs (`generateStaticParams`)
 *   - parse headings out of the source (table of contents)
 *   - extract frontmatter + body for the list page, RSS, sitemap, OG
 *   - compute reading time from word count
 *
 * Frontmatter validation against `BlogFrontmatterSchema` happens at
 * the page level, so a typo'd field surfaces with a clear error.
 */
const CONTENT_DIR = join(process.cwd(), 'src', 'content', 'blog');

/** All available slugs — input to `generateStaticParams`. */
export function getAllPostSlugs(): string[] {
  try {
    return readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => f.replace(/\.mdx$/, ''));
  } catch {
    // Directory missing (e.g. no posts yet) — empty list rather than throw.
    return [];
  }
}

export interface BlogHeading {
  /** 2 for `<h2>`, 3 for `<h3>`. h4+ deliberately skipped for the TOC. */
  depth: 2 | 3;
  text: string;
  /** Slugified id — matches what `rehype-slug` produces. */
  slug: string;
}

/**
 * Same source-side regex strategy as the case-study TOC parser. We
 * strip the YAML frontmatter block + fenced code blocks before
 * scanning so `## comment` inside a code sample doesn't pollute the
 * heading list.
 *
 * `github-slugger` is the same library `rehype-slug` uses, so anchor
 * ids match the rendered HTML exactly.
 */
export function getPostHeadings(slug: string): BlogHeading[] {
  const raw = readPostSource(slug);
  if (!raw) return [];

  const body = raw.replace(/^---\n[\s\S]*?\n---\n/, '');
  const withoutCode = body.replace(/```[\s\S]*?```/g, '');

  const slugger = new GithubSlugger();
  const headings: BlogHeading[] = [];

  for (const line of withoutCode.split('\n')) {
    const m = /^(##|###)\s+(.+)$/.exec(line);
    if (!m) continue;
    const depth = m[1]!.length === 2 ? 2 : 3;
    const text = m[2]!.trim();
    headings.push({ depth, text, slug: slugger.slug(text) });
  }

  return headings;
}

export interface PostMeta {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  tags: string[];
  draft: boolean;
  canonicalUrl?: string;
  coverImage?: string;
  /** Rounded-up minutes. ~200 wpm assumed. */
  readingTime: number;
  /** Word count of the prose body (frontmatter + code blocks stripped). */
  wordCount: number;
}

/**
 * All posts' metadata, sorted newest-first. Excludes drafts by default
 * — drafts are hidden from the list page, sitemap, RSS, and tag chips,
 * but still routable directly during local dev (the post-page route
 * checks the flag and 404s in production).
 */
export function getAllPostMetas({
  includeDrafts = false,
}: { includeDrafts?: boolean } = {}): PostMeta[] {
  const all = getAllPostSlugs()
    .map((slug) => getPostMeta(slug))
    .filter((m): m is PostMeta => m !== null);

  const filtered = includeDrafts ? all : all.filter((m) => !m.draft);

  return filtered.sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0
  );
}

/** Single-post lookup. Returns null on read error / unknown slug. */
export function getPostMeta(slug: string): PostMeta | null {
  const raw = readPostSource(slug);
  if (!raw) return null;

  const fm = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
  if (!fm) return null;
  const block = fm[1]!;
  const body = fm[2]!;

  const pull = (key: string) => {
    // Frontmatter values may be unquoted, single-quoted, or
    // double-quoted; match any of the three.
    const m = new RegExp(`^${key}:\\s*['"]?(.+?)['"]?\\s*$`, 'm').exec(block);
    return m?.[1]?.trim() ?? '';
  };

  // YAML array: `tags: ['a', 'b']` (single-line, comma-separated).
  // Multi-line YAML lists are not supported here — keep it inline.
  const tagsRaw = pull('tags');
  const tags = tagsRaw
    ? tagsRaw
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
    : [];

  const draft = pull('draft') === 'true';
  const canonicalUrl = pull('canonicalUrl') || undefined;
  const coverImage = pull('coverImage') || undefined;

  // Reading time: strip code blocks (less relevant) + inline code +
  // markdown punctuation noise, then count whitespace-separated tokens.
  const prose = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/[#*_>\-[\]()]/g, ' ');
  const words = prose.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return {
    slug,
    title: pull('title'),
    summary: pull('summary'),
    publishedAt: pull('publishedAt'),
    tags,
    draft,
    canonicalUrl,
    coverImage,
    readingTime,
    wordCount,
  };
}

function readPostSource(slug: string): string | null {
  const path = join(CONTENT_DIR, `${slug}.mdx`);
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return null;
  }
}

/**
 * Returns the post body (everything after the closing frontmatter
 * fence) as raw markdown/MDX. Used by the RSS feed to populate
 * `<content:encoded>` so dev.to / Medium / generic feed readers
 * receive the full post text rather than just the summary.
 *
 * Most posts are pure markdown — dev.to renders that fine. The few
 * MDX-only constructs (e.g. our `<Mermaid>` block) won't render on
 * dev.to but degrade gracefully to a fenced code block (which is
 * how the source author wrote them anyway).
 */
export function getPostBody(slug: string): string {
  const raw = readPostSource(slug);
  if (!raw) return '';
  const fm = /^---\n[\s\S]*?\n---\n/.exec(raw);
  return fm ? raw.slice(fm[0].length).trimStart() : raw;
}

/**
 * Every distinct tag in the published post set, sorted by frequency
 * desc then alphabetical. Used by the `/blog` tag filter.
 */
export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const meta of getAllPostMetas()) {
    for (const t of meta.tags) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
