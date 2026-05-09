'use client';

import { useMemo } from 'react';

import { useActiveSection } from '@/lib/hooks/use-active-section';
import { cn } from '@/lib/utils';

type Item = { id: string; label: string };

/**
 * Sticky right-edge section nav for long pages. Hidden under `lg:`
 * because narrow viewports already get the route nav + the page is
 * scrollable enough not to need wayfinding.
 *
 * Each item is a plain `<a href="#id">` so right-click "Open in new
 * tab", browser back/forward, and URL-fragment sharing all keep
 * working. The active item is announced via `aria-current` for
 * screen-readers.
 */
export function SectionRail({ items }: { items: Item[] }) {
  // `useMemo` keeps the ids array reference stable across renders so
  // the hook's effect doesn't re-subscribe on every parent render.
  const ids = useMemo(() => items.map((i) => i.id), [items]);
  const active = useActiveSection(ids);

  return (
    <aside
      aria-label="Section navigation"
      // Anchored to the LEFT edge — the right side already carries the
      // chatbot FAB (`bottom-4 end-4`) and scroll-to-top button
      // (`bottom-20 end-5`); stacking a third floating element there
      // gets crowded. `start-6` is RTL-aware (matches the existing
      // floating-button convention).
      className="fixed top-1/2 start-6 z-30 hidden -translate-y-1/2 flex-col gap-2 lg:flex"
    >
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={isActive ? 'true' : undefined}
            className={cn(
              'group inline-flex items-center gap-2 text-xs transition-colors',
              isActive
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <span
              aria-hidden
              className={cn(
                'size-1.5 rounded-full transition-colors',
                isActive
                  ? 'bg-foreground'
                  : 'bg-muted-foreground/40 group-hover:bg-foreground'
              )}
            />
            <span>{item.label}</span>
          </a>
        );
      })}
    </aside>
  );
}
