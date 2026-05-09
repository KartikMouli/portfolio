import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { format, parseISO } from 'date-fns';

import { siteConfig } from '@/config/site';
import { getAllPostSlugs, getPostMeta } from '@/lib/data/blog';

// Per-post OG / Twitter share card — 1200×630.
// Same terminal-themed brand language as the site-wide and case-study
// cards; content is pulled from the blog post's frontmatter so each
// share preview is post-specific.

// Static module exports — Next reads these at build time and they
// must be JSON-cloneable (functions trigger DataCloneError at the
// Turbopack worker boundary).
export const alt = `Writing by ${siteConfig.author.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Pre-render an OG image for each blog slug at build time. Without
 * this, Next falls back to on-demand generation at request time —
 * the first social-share preview hitting a fresh deploy would stall
 * while Satori warms up.
 */
export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OpengraphImage({ params }: Props) {
  const { slug } = await params;
  const meta = getPostMeta(slug);

  // Defensive — `generateStaticParams` should have filtered this, but
  // an unknown slug gets a sensible fallback rather than a build crash.
  const title = meta?.title ?? slug;
  const summary = meta?.summary ?? '';
  const publishedAt = meta?.publishedAt ?? '';
  const tags = meta?.tags ?? [];
  const readingTime = meta?.readingTime ?? 0;

  const [bold, regular] = await Promise.all([
    readFile(join(process.cwd(), 'src/app/_fonts/JetBrainsMono-Bold.ttf')),
    readFile(join(process.cwd(), 'src/app/_fonts/JetBrainsMono-Regular.ttf')),
  ]);

  // Same palette as the other OG cards. sRGB picks (Satori doesn't
  // accept OKLCH).
  const COPPER = '#A65A2E';
  const CREAM = '#F5EFDE';
  const MUTED = '#8A8270';
  const INK = '#1A1714';

  // Long summaries either overflow or shrink the title visually —
  // truncate at a sensible card-width ceiling.
  const summaryDisplay =
    summary.length > 140 ? `${summary.slice(0, 137).trimEnd()}…` : summary;

  let dateDisplay = '';
  try {
    if (publishedAt) {
      dateDisplay = format(parseISO(publishedAt), 'MMMM d, yyyy');
    }
  } catch {
    dateDisplay = '';
  }

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: INK,
        padding: 64,
        fontFamily: '"JetBrains Mono"',
        color: CREAM,
      }}
    >
      {/* terminal title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          paddingBottom: 28,
          borderBottom: '1px solid #2a2520',
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 14,
            background: '#3a352c',
          }}
        />
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 14,
            background: '#3a352c',
          }}
        />
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 14,
            background: '#3a352c',
          }}
        />
        <div
          style={{
            marginLeft: 'auto',
            fontSize: 18,
            color: MUTED,
          }}
        >
          {siteConfig.url.replace(/^https?:\/\//, '')}/blog/{slug}
        </div>
      </div>

      {/* body */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          paddingTop: 48,
          flex: 1,
        }}
      >
        {/* prompt: cat <slug>.md */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            fontSize: 26,
            color: MUTED,
            fontWeight: 400,
          }}
        >
          <span style={{ color: COPPER, fontWeight: 700 }}>$</span>
          <span>cat {slug}.md</span>
        </div>

        {/* Title — large, may wrap to 2-3 lines naturally inside the
              fixed-width card. Tightened tracking so multi-line titles
              read as one block. */}
        <div
          style={{
            display: 'flex',
            fontSize: 60,
            fontWeight: 700,
            letterSpacing: -2,
            color: CREAM,
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>

        {/* Date · reading time · tags */}
        <div
          style={{
            display: 'flex',
            fontSize: 22,
            color: MUTED,
            fontWeight: 400,
            letterSpacing: -0.3,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {dateDisplay && <span>{dateDisplay}</span>}
          {dateDisplay && readingTime > 0 && (
            <span style={{ padding: '0 12px' }}>·</span>
          )}
          {readingTime > 0 && <span>{readingTime} min read</span>}
          {tags.length > 0 && (
            <>
              <span style={{ padding: '0 12px' }}>·</span>
              <span style={{ color: COPPER }}>
                {tags.slice(0, 4).join(' · ')}
              </span>
            </>
          )}
        </div>

        {/* Summary */}
        {summaryDisplay && (
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              color: CREAM,
              fontWeight: 400,
              letterSpacing: -0.3,
              lineHeight: 1.4,
              marginTop: 8,
            }}
          >
            {summaryDisplay}
          </div>
        )}
      </div>

      {/* footer brand mark */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          paddingTop: 24,
          borderTop: '1px solid #2a2520',
          fontSize: 22,
          color: MUTED,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '6px 12px',
            background: '#2a2520',
            borderRadius: 8,
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          <span style={{ color: COPPER }}>&gt;</span>
          <span style={{ color: CREAM }}>km_</span>
        </div>
        <span style={{ marginLeft: 'auto' }}>
          {siteConfig.author.name} · Writing
        </span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: 'JetBrains Mono',
          data: regular,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'JetBrains Mono',
          data: bold,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );
}
