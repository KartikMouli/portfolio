import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { siteConfig } from '@/config/site';

// OG / Twitter share card — 1200×630.
// Terminal-themed brand card matching the favicon, driven by siteConfig.
// Used by both `openGraph` and `twitter` metadata in `layout.tsx`.

export const alt = `${siteConfig.author.name} — ${siteConfig.author.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const [bold, regular] = await Promise.all([
    readFile(join(process.cwd(), 'src/app/_fonts/JetBrainsMono-Bold.ttf')),
    readFile(join(process.cwd(), 'src/app/_fonts/JetBrainsMono-Regular.ttf')),
  ]);

  const COPPER = '#A65A2E';
  const CREAM = '#F5EFDE';
  const MUTED = '#8A8270';
  const INK = '#1A1714';

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
            fontSize: 20,
            color: MUTED,
          }}
        >
          {siteConfig.url.replace(/^https?:\/\//, '')}
        </div>
      </div>

      {/* body */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
          paddingTop: 56,
          flex: 1,
        }}
      >
        {/* prompt + name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            fontSize: 32,
            color: MUTED,
            fontWeight: 400,
          }}
        >
          <span style={{ color: COPPER, fontWeight: 700 }}>$</span>
          <span>whoami</span>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: -3,
            color: CREAM,
            lineHeight: 1,
          }}
        >
          {siteConfig.author.name}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 36,
            color: MUTED,
            fontWeight: 400,
            letterSpacing: -1,
          }}
        >
          {siteConfig.author.role}
          <span style={{ color: COPPER, padding: '0 14px' }}>·</span>
          <span>{siteConfig.author.location.replace(/\s*🇮🇳\s*$/, '')}</span>
        </div>

        {/* second prompt: stack */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            fontSize: 28,
            color: MUTED,
            fontWeight: 400,
            marginTop: 24,
          }}
        >
          <span style={{ color: COPPER, fontWeight: 700 }}>$</span>
          <span>cat stack.txt</span>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            color: CREAM,
            fontWeight: 400,
            letterSpacing: -0.5,
          }}
        >
          React · Next.js · TypeScript · Node.js
        </div>
      </div>

      {/* footer brand mark */}
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
          {siteConfig.links.github.replace(/^https?:\/\//, '')}
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
