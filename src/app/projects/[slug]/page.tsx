import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

import { CaseStudyToc } from '@/components/case-study/toc';
import { CaseStudyJsonLd } from '@/components/seo/case-study-jsonld';
import { H1, Muted } from '@/components/typography';
import {
  getAllCaseStudySlugs,
  getCaseStudyHeadings,
} from '@/lib/data/case-studies';
import { CaseStudyFrontmatterSchema } from '@/lib/schemas';
import { siteConfig } from '@/config/site';

/**
 * Pre-render every known case-study slug at build time. Next 16's
 * `cacheComponents` mode rejects the `dynamicParams = false` segment
 * export — that's why we 404 manually below instead. Pre-rendered
 * routes are still cached; only unknown slugs go through the
 * runtime check.
 */
export function generateStaticParams() {
  return getAllCaseStudySlugs().map((slug) => ({ slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Dynamically import the MDX module for `slug`. Returns both the
 * default export (the rendered component) and `frontmatter` (a plain
 * object exposed by `remark-mdx-frontmatter` in `next.config.js`).
 * The schema validates the frontmatter shape so a typo'd field fails
 * loud at the page level instead of producing a half-rendered article.
 *
 * Slug validity is checked against the filesystem listing first —
 * dynamic `import()` of a missing path throws an unhelpful error;
 * this short-circuits with a clean 404 instead.
 */
async function loadCaseStudy(slug: string) {
  if (!getAllCaseStudySlugs().includes(slug)) {
    notFound();
  }
  const mod = await import(`@/content/case-studies/${slug}.mdx`);
  const meta = CaseStudyFrontmatterSchema.parse(mod.frontmatter);
  if (meta.slug !== slug) {
    throw new Error(
      `Slug mismatch in ${slug}.mdx — frontmatter says "${meta.slug}", filename says "${slug}".`
    );
  }
  return { Post: mod.default as () => React.JSX.Element, meta };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = await loadCaseStudy(slug);
  return {
    title: meta.title,
    description: meta.summary,
    alternates: { canonical: `${siteConfig.url}/projects/${slug}` },
    openGraph: {
      title: meta.title,
      description: meta.summary,
      type: 'article',
      publishedTime: meta.publishedAt,
      ...(meta.heroImage ? { images: [meta.heroImage] } : {}),
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const { Post, meta } = await loadCaseStudy(slug);
  const headings = getCaseStudyHeadings(slug);
  const published = format(parseISO(meta.publishedAt), 'MMMM d, yyyy');

  return (
    <>
      <CaseStudyJsonLd meta={meta} />
      {/* TOC is `position: fixed` and `lg:`-only — it sits in the right
          gutter outside the article column, so we render it as a sibling
          rather than nesting inside <article>. */}
      <CaseStudyToc headings={headings} />
      <article className="mx-auto mt-8 w-full max-w-3xl px-4 pb-16 sm:px-8">
        <Link
          href="/projects"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          All projects
        </Link>

        <header className="mb-8 space-y-4">
          <H1>{meta.title}</H1>
          <Muted>
            {meta.projectName} · {published}
          </Muted>
        </header>

        {/* MDX components are wired globally via `src/mdx-components.tsx`
            (required by `@next/mdx` for App Router) — no per-page
            components prop needed. */}
        <div className="space-y-6">
          <Post />
        </div>
      </article>
    </>
  );
}
