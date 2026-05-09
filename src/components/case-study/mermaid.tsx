'use client';

import { useEffect, useId, useState } from 'react';
import { useTheme } from 'next-themes';

interface MermaidProps {
  chart: string;
}

/**
 * Renders a Mermaid diagram from the source code in `chart`.
 *
 * Why client-only + dynamic import: the `mermaid` package is ~700 KB
 * minified and pulls in DOM APIs at module-init. Lazy-loading it from
 * an effect keeps it out of the initial bundle for every other route
 * — only readers who hit a case-study page with a diagram pay for it.
 *
 * Theme: `'base'` + a brand-aligned `themeVariables` palette that
 * matches the site's warm-cream / ink design tokens (sRGB picks,
 * Mermaid's theme variables don't accept OKLCH). Re-renders on
 * `next-themes` switch so the diagram inverts cleanly with the page.
 *
 * Wired into MDX via `mdx-components.tsx`'s `code` mapping —
 * fenced ```mermaid blocks get rendered through this component
 * instead of as plain code.
 */
export function Mermaid({ chart }: MermaidProps) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const id = useId();
  const { resolvedTheme } = useTheme();

  // Resolve only after mount — `resolvedTheme` is undefined during SSR
  // and the first paint, which would cause a flash of mismatched theme.
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    let cancelled = false;

    // Defer one tick so the theme has resolved on initial mount.
    const timeoutId = setTimeout(() => {
      (async () => {
        try {
          const mermaid = (await import('mermaid')).default;

          // Brand palette mirrored from `globals.css` and the OG card.
          // Sticking to copper / cream / ink keeps diagrams visually
          // consistent with the rest of the case-study page.
          const COPPER = '#A65A2E';
          const CREAM = '#F5EFDE';
          const MUTED = '#8A8270';
          const INK = '#1A1714';
          const LIGHT_BG = '#ECE6D6';

          mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            // `securityLevel: 'strict'` (default) blocks rendering of any
            // diagram that uses click handlers / external links — fine
            // for case studies where we author the source ourselves.
            themeVariables: {
              background: 'transparent',
              primaryColor: isDark ? '#2a2520' : LIGHT_BG,
              primaryTextColor: isDark ? CREAM : INK,
              primaryBorderColor: isDark ? MUTED : MUTED,
              lineColor: isDark ? MUTED : MUTED,
              secondaryColor: isDark ? '#3a352c' : LIGHT_BG,
              tertiaryColor: isDark ? INK : LIGHT_BG,
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '14px',
              edgeLabelBackground: isDark ? INK : LIGHT_BG,
              clusterBkg: isDark ? '#2a2520' : LIGHT_BG,
              clusterBorder: COPPER,
            },
          });

          // Mermaid IDs must start with a letter; `useId` returns a colon-
          // prefixed string in React 19. Strip non-word chars to be safe.
          const safeId = `mmd-${id.replace(/\W/g, '')}`;
          const { svg } = await mermaid.render(safeId, chart);
          if (!cancelled) {
            setSvg(svg);
            setError(null);
          }
        } catch (e) {
          if (!cancelled) {
            setError(
              e instanceof Error ? e.message : 'Failed to render diagram.'
            );
          }
        }
      })();
    }, 0);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [chart, id, isDark]);

  if (error) {
    return (
      <pre className="my-4 overflow-x-auto rounded-md border border-destructive/40 bg-destructive/5 p-4 font-mono text-xs text-destructive">
        Mermaid render error: {error}
      </pre>
    );
  }

  if (!svg) {
    // Skeleton: keep vertical space stable so the page doesn't
    // jank as the diagram lazy-resolves.
    return (
      <div
        aria-hidden
        className="my-4 h-48 animate-pulse rounded-md border border-border/50 bg-muted/30"
      />
    );
  }

  return (
    <div
      className="my-4 flex justify-center overflow-x-auto rounded-md border border-border/50 bg-muted/30 p-4 [&>svg]:h-auto [&>svg]:max-w-full"
      role="img"
      aria-label="Diagram"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
