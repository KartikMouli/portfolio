import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

import { CaseStudyToc } from '@/components/case-study/toc';
import { H1, Muted } from '@/components/typography';
import { getAllPostSlugs, getPostHeadings, getPostMeta } from '@/lib/data/blog';
import { BlogFrontmatterSchema } from '@/lib/schemas';
import { siteConfig } from '@/config/site';

/**
 * Pre-render every known blog slug at build time. Same constraint as
 * the case-study route — Next 16's `cacheComponents` mode rejects the
 * `dynamicParams = false` segment export, so we 404 manually below
 * for unknown slugs.
 */
export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Dynamically import the MDX module for `slug`. Returns the rendered
 * component + the validated frontmatter. Slug validity is checked
 * against the filesystem listing first — `import()` of a missing path
 * throws an unhelpful error; this short-circuits with a clean 404.
 *
 * Drafts 404 in production (`NODE_ENV === 'production'`); they remain
 * routable in dev so previews work without flipping the flag.
 */
async function loadPost(slug: string) {
  if (!getAllPostSlugs().includes(slug)) {
    notFound();
  }
  const mod = await import(`@/content/blog/${slug}.mdx`);
  const meta = BlogFrontmatterSchema.parse(mod.frontmatter);
  if (meta.slug !== slug) {
    throw new Error(
      `Slug mismatch in ${slug}.mdx — frontmatter says "${meta.slug}", filename says "${slug}".`
    );
  }
  if (meta.draft && process.env.NODE_ENV === 'production') {
    notFound();
  }
  return { Post: mod.default as () => React.JSX.Element, meta };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = await loadPost(slug);
  // Most posts are canonical here (cross-posts on dev.to/Medium point
  // back). For the rare guest-post-archive case, frontmatter overrides.
  const canonical = meta.canonicalUrl ?? `${siteConfig.url}/blog/${slug}`;
  return {
    title: meta.title,
    description: meta.summary,
    alternates: { canonical },
    openGraph: {
      title: meta.title,
      description: meta.summary,
      type: 'article',
      url: `${siteConfig.url}/blog/${slug}`,
      publishedTime: meta.publishedAt,
      tags: meta.tags,
      ...(meta.coverImage ? { images: [meta.coverImage] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.summary,
      ...(meta.coverImage ? { images: [meta.coverImage] } : {}),
    },
    // Hidden from search if the author left it as a draft (which only
    // surfaces in dev anyway, but worth a belt-and-braces).
    ...(meta.draft ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const { Post, meta } = await loadPost(slug);
  // Word count comes from `getPostMeta`; the route gets it for free
  // here so we don't re-read the file.
  const stats = getPostMeta(slug);
  const headings = getPostHeadings(slug);
  const published = format(parseISO(meta.publishedAt), 'MMMM d, yyyy');

  return (
    <>
      {/* TOC is `position: fixed` and `lg:`-only — sibling of <article>
          so it sits in the right gutter outside the reading column.
          The case-study TOC component is generic enough to reuse here:
          same heading shape, same active-section behaviour. */}
      <CaseStudyToc headings={headings} />
      <article className="mx-auto mt-8 w-full max-w-3xl px-4 pb-16 sm:px-8">
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          All writing
        </Link>

        <header className="mb-8 space-y-4">
          <H1>{meta.title}</H1>
          <Muted>
            <time dateTime={meta.publishedAt}>{published}</time>
            {stats && (
              <>
                <span className="mx-2" aria-hidden>
                  ·
                </span>
                {stats.readingTime} min read
              </>
            )}
            {meta.tags.length > 0 && (
              <>
                <span className="mx-2" aria-hidden>
                  ·
                </span>
                <span className="font-mono text-xs uppercase tracking-wider">
                  {meta.tags.join(' · ')}
                </span>
              </>
            )}
          </Muted>
        </header>

        {/* MDX components are wired globally via `src/mdx-components.tsx`
            (required by `@next/mdx` for App Router) — no per-page
            components prop needed. The Mermaid + code mappings work
            here exactly like they do on case-study pages. */}
        <div className="space-y-6">
          <Post />
        </div>
      </article>
    </>
  );
}
