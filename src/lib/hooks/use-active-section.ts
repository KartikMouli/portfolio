'use client';

import { useEffect, useState } from 'react';

/**
 * Returns the id of whichever of the given section ids is most-active
 * in the viewport. Single IntersectionObserver watches every target;
 * `rootMargin` shifts the activation line up by 40% from the top and
 * 55% from the bottom so a section becomes active once its top has
 * crossed roughly the top-third of the viewport — the standard
 * docs-site behaviour (Tailwind, Stripe, MDN).
 *
 * Returns `null` until something has intersected. Caller must keep the
 * `ids` array reference stable (e.g. memoize or define module-level)
 * — the effect re-runs whenever it changes.
 *
 * Used by:
 *   - `<SectionRail>` on `/` (anchors home-page sections)
 *   - `<CaseStudyToc>` on `/projects/[slug]` (anchors article headings)
 */
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
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
  }, [ids]);

  return active;
}
