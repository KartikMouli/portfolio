import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { format, parseISO } from 'date-fns';

import { siteConfig } from '@/config/site';
import {
  getAllCaseStudySlugs,
  getCaseStudyMetas,
} from '@/lib/data/case-studies';

// Per-case-study OG / Twitter share card — 1200×630.
// Same terminal-themed brand language as the site-wide card
// (`src/app/opengraph-image.tsx`); content is pulled from the MDX
// frontmatter so each case study gets its own preview when shared
// to LinkedIn / X / Slack.

export const alt = (props: { params: { slug: string } }) =>
  `${props.params.slug} — case study by ${siteConfig.author.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Pre-render an OG image for each case-study slug at build time. Mirror
 * of the page route's `generateStaticParams` — without it, Next falls
 * back to on-demand generation at request time, which can stall the
 * first social-share preview that hits a fresh deploy.
 */
export function generateStaticParams() {
  return getAllCaseStudySlugs().map((slug) => ({ slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OpengraphImage({ params }: Props) {
  const { slug } = await params;
  const meta = getCaseStudyMetas().find((m) => m.slug === slug);

  // Defensive — `generateStaticParams` should have filtered this, but
  // an unknown slug gets a sensible fallback rather than a build crash.
  const title = meta?.title ?? slug;
  const projectName = meta?.projectName ?? slug;
  const summary = meta?.summary ?? '';
  const publishedAt = meta?.publishedAt ?? '';

  const [bold, regular] = await Promise.all([
    readFile(join(process.cwd(), 'src/app/_fonts/JetBrainsMono-Bold.ttf')),
    readFile(join(process.cwd(), 'src/app/_fonts/JetBrainsMono-Regular.ttf')),
  ]);

  // Same palette as the site-wide OG. Matches the warm-cream design
  // system tokens at OG-card scale (these are sRGB picks, not OKLCH —
  // ImageResponse / Satori works in sRGB).
  const COPPER = '#A65A2E';
  const CREAM = '#F5EFDE';
  const MUTED = '#8A8270';
  const INK = '#1A1714';

  // Truncate the summary to keep the layout balanced — long summaries
  // either overflow or shrink the title's visual weight.
  const summaryDisplay =
    summary.length > 140 ? `${summary.slice(0, 137).trimEnd()}…` : summary;

  // Format the date if present and parseable; otherwise omit the line
  // entirely rather than showing "Invalid Date".
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
          borderBottom: `1px solid #2a2520`,
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
          {siteConfig.url.replace(/^https?:\/\//, '')}/projects/{slug}
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
              fixed-width card. Letter-spacing tightened so multi-line
              titles read as one block, not three loose lines. */}
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

        {/* Project name · date */}
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            color: MUTED,
            fontWeight: 400,
            letterSpacing: -0.5,
          }}
        >
          <span style={{ color: COPPER }}>{projectName}</span>
          {dateDisplay && (
            <>
              <span style={{ color: MUTED, padding: '0 14px' }}>·</span>
              <span>{dateDisplay}</span>
            </>
          )}
        </div>

        {/* Summary — muted body text. */}
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

      {/* footer brand mark — identical to site-wide OG so the brand
            stays consistent across share types. */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          paddingTop: 24,
          borderTop: `1px solid #2a2520`,
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
          {siteConfig.author.name} · Case study
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
