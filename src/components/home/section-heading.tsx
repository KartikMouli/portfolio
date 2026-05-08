'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

import { H2 } from '@/components/typography';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  /** Heading text or composed nodes (e.g. label + count chip). */
  children: ReactNode;
  /** Optional inline element to the right of the heading (e.g. a
   *  "view more" link). When set, the wrapper becomes flex+between. */
  trailing?: ReactNode;
  /** Extra classes on the inner `<H2>` — used when the heading needs
   *  its own layout (e.g. `flex items-center gap-2` for a count chip). */
  headingClassName?: string;
  /** Extra classes on the outer wrapper. */
  className?: string;
}

/**
 * Section heading with an animated underline. The 2px line draws
 * left-to-right when the heading scrolls into view, once per page
 * load. Final visual matches the static `border-b-2 pb-3` pattern
 * used by home-page sections — same color (`bg-border`), same
 * thickness (`h-0.5`), same bottom padding.
 *
 * Drop-in for the `<H2 className="border-b-2 pb-3">{...}</H2>`
 * pattern. The heading itself is rendered via the project's `<H2>`
 * primitive so typography stays consistent with the rest of the
 * site.
 *
 * Honors `prefers-reduced-motion` — the underline appears at full
 * width immediately for users who opted in.
 */
export function SectionHeading({
  children,
  trailing,
  headingClassName,
  className,
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  // `amount: 0.3` matches the section-rail's activation zone so the
  // underline draws at roughly the same scroll position the rail's
  // dot fills — they read as one coordinated motion.
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();

  return (
    <div
      ref={ref}
      className={cn(
        'relative pb-3',
        trailing && 'flex items-center justify-between',
        className
      )}
    >
      <H2 className={cn('border-b-0 pb-0', headingClassName)}>{children}</H2>
      {trailing}
      <motion.span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-border"
        initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: reduce ? 0 : 0.5, ease: 'easeOut' }}
      />
    </div>
  );
}
