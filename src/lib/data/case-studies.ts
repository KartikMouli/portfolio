import 'server-only';

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import GithubSlugger from 'github-slugger';

/**
 * Filesystem layout: `src/content/case-studies/<slug>.mdx`. Slugs are
 * the filename without extension. With `@next/mdx` doing the actual
 * compilation via `await import(...)` in the page route, this file's
 * job is to:
 *   - enumerate the available slugs (`generateStaticParams`)
 *   - parse headings out of the MDX source for the table-of-contents
 *
 * Frontmatter parsing happens at the page level via
 * `CaseStudyFrontmatterSchema` against the `frontmatter` export
 * surfaced by `remark-mdx-frontmatter`.
 */
const CONTENT_DIR = join(process.cwd(), 'src', 'content', 'case-studies');

/** All available slugs — used by `generateStaticParams`. */
export function getAllCaseStudySlugs(): string[] {
  try {
    return readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => f.replace(/\.mdx$/, ''));
  } catch {
    // Directory missing (e.g. no case studies written yet) — empty list.
    return [];
  }
}

export interface CaseStudyMeta {
  slug: string;
  /** ISO yyyy-mm-dd from frontmatter. */
  publishedAt: string;
  title: string;
  summary: string;
  projectName: string;
}

/**
 * Cheap frontmatter scan — pulls just the fields the sitemap, OG card,
 * and JSON-LD generator need without paying the cost of full MDX
 * compilation. Same regex strategy as `getCaseStudyHeadings`.
 *
 * Validation against `CaseStudyFrontmatterSchema` still runs at the
 * page level (`loadCaseStudy` in the route), so a malformed frontmatter
 * here surfaces with a clear error when the page is requested rather
 * than silently producing empty sitemap rows.
 */
export function getCaseStudyMetas(): CaseStudyMeta[] {
  return getAllCaseStudySlugs().map((slug) => {
    const path = join(CONTENT_DIR, `${slug}.mdx`);
    let raw: string;
    try {
      raw = readFileSync(path, 'utf8');
    } catch {
      return {
        slug,
        publishedAt: '',
        title: slug,
        summary: '',
        projectName: '',
      };
    }
    const fm = /^---\n([\s\S]*?)\n---/.exec(raw);
    const block = fm?.[1] ?? '';
    const pull = (key: string) => {
      // Frontmatter values may be unquoted, single-quoted, or
      // double-quoted — match whichever the MDX file used.
      const m = new RegExp(`^${key}:\\s*['"]?(.+?)['"]?\\s*$`, 'm').exec(block);
      return m?.[1]?.trim() ?? '';
    };
    return {
      slug,
      publishedAt: pull('publishedAt'),
      title: pull('title'),
      summary: pull('summary'),
      projectName: pull('projectName'),
    };
  });
}

/**
 * Returns the case-study body (everything after the closing
 * frontmatter fence) as raw markdown/MDX. Mirror of `getPostBody` in
 * `blog.ts`. Used by `CaseStudyJsonLd` to populate `Article.articleBody`
 * so AI search engines have grounded prose to cite.
 */
export function getCaseStudyBody(slug: string): string {
  const path = join(CONTENT_DIR, `${slug}.mdx`);
  let raw: string;
  try {
    raw = readFileSync(path, 'utf8');
  } catch {
    return '';
  }
  const fm = /^---\n[\s\S]*?\n---\n/.exec(raw);
  return fm ? raw.slice(fm[0].length).trimStart() : raw;
}

export interface CaseStudyHeading {
  /** 2 for `<h2>`, 3 for `<h3>`. We deliberately skip h4+ for the TOC. */
  depth: 2 | 3;
  /** Visible heading text. */
  text: string;
  /** Slugified id, must match what `rehype-slug` produces in the
   *  rendered HTML (same algorithm — both use `github-slugger`). */
  slug: string;
}

/**
 * Parse `<h2>` and `<h3>` headings out of a case-study MDX source.
 *
 * Why parse the source instead of the rendered output: there's no
 * runtime hook into MDX compilation to introspect headings, and
 * shipping a remark plugin just to expose them is more setup. The
 * source-side regex handles the cases that matter (frontmatter
 * stripped, fenced code blocks ignored so `## comment` inside a code
 * block doesn't leak in).
 *
 * `github-slugger` is the same library `rehype-slug` uses internally,
 * so the ids it produces match the heading anchors in the rendered
 * HTML — TOC links jump to the right place.
 */
export function getCaseStudyHeadings(slug: string): CaseStudyHeading[] {
  const path = join(CONTENT_DIR, `${slug}.mdx`);
  let raw: string;
  try {
    raw = readFileSync(path, 'utf8');
  } catch {
    return [];
  }

  // Strip the YAML frontmatter block (between `---` markers at the top).
  const body = raw.replace(/^---\n[\s\S]*?\n---\n/, '');
  // Strip fenced code blocks so headings inside them aren't picked up.
  const withoutCode = body.replace(/```[\s\S]*?```/g, '');

  const slugger = new GithubSlugger();
  const headings: CaseStudyHeading[] = [];

  for (const line of withoutCode.split('\n')) {
    const m = /^(##|###)\s+(.+)$/.exec(line);
    if (!m) continue;
    const depth = m[1]!.length === 2 ? 2 : 3;
    const text = m[2]!.trim();
    headings.push({ depth, text, slug: slugger.slug(text) });
  }

  return headings;
}
