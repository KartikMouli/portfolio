'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
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
            // `useMaxWidth: true` (the default) pins the SVG to its
            // intrinsic pixel width, so a small diagram stays small in
            // the middle of a wide article. We strip the dimensions
            // below and let the viewBox scale to the container instead.
            flowchart: { useMaxWidth: false },
            sequence: { useMaxWidth: false },
            gantt: { useMaxWidth: false },
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
          // Mermaid still emits fixed `width`/`height` attributes and a
          // `max-width` inline style on the root <svg>. Strip all three
          // so only the viewBox drives sizing — the CSS below then
          // scales the diagram to the full column width.
          const responsive = svg
            .replace(/\s*max-width:\s*[\d.]+px;?/g, '')
            .replace(/(<svg[^>]*?)\swidth="[^"]*"/, '$1')
            .replace(/(<svg[^>]*?)\sheight="[^"]*"/, '$1');
          if (!cancelled) {
            setSvg(responsive);
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

  /**
   * Mermaid's own viewBox is unreliable — it measures `foreignObject`
   * HTML labels before webfonts settle and routinely overshoots. We've
   * seen a 970×194 flowchart emitted with a 2114×2052 viewBox, which
   * renders the diagram tiny in the corner of a mostly-empty box.
   *
   * Once the SVG is in the DOM we can ask the browser what was actually
   * drawn (`getBBox`) and retarget the viewBox at those bounds. Layout
   * effect so the correction lands before paint — no visible reflow.
   */
  useLayoutEffect(() => {
    if (!svg) return;
    const el = containerRef.current?.querySelector('svg');
    const root = el?.querySelector('g');
    if (!el || !root) return;

    try {
      const box = root.getBBox();
      if (box.width <= 0 || box.height <= 0) return;
      const pad = 8;
      el.setAttribute(
        'viewBox',
        `${box.x - pad} ${box.y - pad} ${box.width + pad * 2} ${box.height + pad * 2}`
      );
    } catch {
      // getBBox throws if the element isn't rendered (display:none,
      // detached). Leaving Mermaid's viewBox in place is the safe
      // fallback — an oversized diagram beats a crashed page.
    }
  }, [svg]);

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
      ref={containerRef}
      className="my-6 overflow-x-auto rounded-md border border-border/50 bg-muted/30 p-4 sm:p-6 [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
      role="img"
      aria-label="Diagram"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
