import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Apple touch icon — recommended 180×180.
// Renders the same terminal mark as `icon.svg` with real JetBrains Mono.
// Generated at build time by Next.js (Node.js runtime, not Edge — fs is used).

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default async function AppleIcon() {
  const fontData = await readFile(
    join(process.cwd(), 'src/app/_fonts/JetBrainsMono-Bold.ttf')
  );

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1A1714',
        borderRadius: 40, // matches the SVG corner radius proportionally
        fontFamily: '"JetBrains Mono"',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: 64,
          fontWeight: 700,
          letterSpacing: -2,
        }}
      >
        <span style={{ color: '#A65A2E' }}>&gt;</span>
        <span style={{ color: '#F5EFDE' }}>km_</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: 'JetBrains Mono',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );
}
