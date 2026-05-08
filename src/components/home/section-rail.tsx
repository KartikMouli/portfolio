'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

type Item = { id: string; label: string };

/**
 * Returns the id of whichever of the given sections is most-active in
 * the viewport. Single IntersectionObserver watches every target;
 * `rootMargin` shifts the activation line up by 40% from the top and
 * 55% from the bottom so a section becomes active once its top has
 * crossed roughly the top-third of the viewport — the standard
 * docs-site behaviour (Tailwind, Stripe).
 *
 * Returns `null` until something has intersected. Caller must keep the
 * `items` array reference stable (e.g. module-level const) — the
 * effect re-runs whenever it changes.
 */
function useActiveSection(items: Item[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = items
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Of the currently-intersecting entries, pick the one nearest
        // the top of the viewport — that's the section the reader is
        // visually anchored on.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const id = visible[0]!.target.id;
          if (id) setActive(id);
        }
      },
      { rootMargin: '-40% 0% -55% 0%', threshold: 0 }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [items]);

  return active;
}

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
  const active = useActiveSection(items);

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
