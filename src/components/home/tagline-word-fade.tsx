'use client';

import { motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';

interface TaglineWordFadeProps {
  text: string;
  className?: string;
}

/**
 * Word-by-word fade-up for hero taglines. Each word fades in from
 * 4px below, staggered 80ms apart, total duration ~350ms per word.
 * Plays once on mount, then static.
 *
 * Accessibility:
 *   - Wrapper carries `aria-label` so screen readers read the whole
 *     string; per-word spans are `aria-hidden`.
 *   - Honours `prefers-reduced-motion`: words appear immediately
 *     with no animation.
 *
 * Each word is wrapped in `inline-block` so the per-word `y` transform
 * has effect — `transform` doesn't apply to inline elements.
 * Non-breaking spaces (` `) join words so the line stays together
 * at the typical hero width; for very narrow viewports the browser
 * will still wrap between word spans.
 */
export function TaglineWordFade({ text, className }: TaglineWordFadeProps) {
  const reduce = useReducedMotion();
  const words = text.split(' ');

  return (
    <span aria-label={text} className={cn('inline-block', className)}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          aria-hidden
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: reduce ? 0 : i * 0.08,
            duration: reduce ? 0 : 0.35,
            ease: 'easeOut',
          }}
          className="inline-block"
        >
          {word}
          {i < words.length - 1 && ' '}
        </motion.span>
      ))}
    </span>
  );
}
