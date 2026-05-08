'use client';

import { useMemo } from 'react';

import { useActiveSection } from '@/lib/hooks/use-active-section';
import type { CaseStudyHeading } from '@/lib/data/case-studies';
import { cn } from '@/lib/utils';

/**
 * Sticky right-edge table of contents for case-study pages. Hidden
 * under `lg:` because narrow viewports already get a single-column
 * reading layout where a TOC adds noise rather than wayfinding.
 *
 * Anchored top-right (`top-32 end-6`) rather than vertically centered
 * — TOCs grow downward from the article's top, so anchoring near the
 * top reads correctly for both short and long lists. Internal scroll
 * (`overflow-y-auto`) handles cases with many H3s.
 *
 * Each item is a plain `<a href="#slug">` so right-click → "open in
 * new tab", browser back/forward, and URL-fragment sharing all keep
 * working. Active item gets `aria-current` for screen-readers.
 */
export function CaseStudyToc({ headings }: { headings: CaseStudyHeading[] }) {
  // Memoize the slug array so the hook's effect dep stays stable.
  const ids = useMemo(() => headings.map((h) => h.slug), [headings]);
  const active = useActiveSection(ids);

  if (headings.length === 0) return null;

  return (
    <aside
      aria-label="Table of contents"
      className="fixed top-32 end-6 z-30 hidden max-h-[calc(100vh-9rem)] w-44 flex-col gap-1 overflow-y-auto lg:flex"
    >
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </div>
      {headings.map((h) => {
        const isActive = active === h.slug;
        return (
          <a
            key={h.slug}
            href={`#${h.slug}`}
            aria-current={isActive ? 'true' : undefined}
            // H3s indent under their parent H2. text-xs across the
            // board keeps the rail visually quiet.
            className={cn(
              'block text-xs leading-relaxed transition-colors',
              h.depth === 3 && 'pl-3',
              isActive
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {h.text}
          </a>
        );
      })}
    </aside>
  );
}
