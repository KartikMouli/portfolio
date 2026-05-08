'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Floating "back to top" button. Fades in once the viewport has scrolled
 * past 50% of its own height (i.e. the user is roughly past the fold).
 *
 * Uses `requestAnimationFrame` to coalesce scroll events — cheaper than
 * firing setState on every wheel tick, and avoids the layout thrash that
 * shows up on long pages like /privacy.
 *
 * Honors `prefers-reduced-motion` via the global rule in `globals.css`,
 * which clamps `scroll-behavior: smooth` back to `auto` for those users.
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > window.innerHeight * 0.5);
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once for in-route navigations that keep scroll
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'fixed bottom-6 right-6 z-40 size-10 rounded-full shadow-md transition-all duration-200 ease-out',
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-2 opacity-0'
      )}
    >
      <ArrowUp className="size-4" />
    </Button>
  );
}
