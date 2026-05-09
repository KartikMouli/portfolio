'use client';

import type { HTMLMotionProps, Variants } from 'motion/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import type { CopyState } from '@/hooks/use-copy-to-clipboard';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Copy, Check, CircleX } from 'lucide-react';

export const motionIconVariants: Variants = {
  initial: { opacity: 0, scale: 0.8, filter: 'blur(2px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 0.8 },
};

export const motionIconProps: HTMLMotionProps<'span'> = {
  variants: motionIconVariants,
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
  transition: { duration: 0.15, ease: 'easeOut' },
};

export type CopyStateIconProps = {
  state: CopyState;
  /** Custom icon for idle state. */
  idleIcon?: React.ReactNode;
  /** Custom icon for done state. */
  doneIcon?: React.ReactNode;
  /** Custom icon for error state. */
  errorIcon?: React.ReactNode;
};

export function CopyStateIcon({
  state,
  idleIcon,
  doneIcon,
  errorIcon,
}: CopyStateIconProps) {
  // Honour OS-level reduce-motion: motion/react animations are
  // requestAnimationFrame-driven JS and bypass the global CSS
  // `animation-duration: 0.01ms` rule in `globals.css`. This zeroes
  // the duration explicitly so reduce-motion users get an instant
  // icon swap instead of a 150ms scale + blur.
  const reduce = useReducedMotion();
  const props: HTMLMotionProps<'span'> = reduce
    ? {
        ...motionIconProps,
        transition: { duration: 0 },
        initial: 'animate',
      }
    : motionIconProps;

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {state === 'idle' ? (
        <motion.span key="idle" {...props}>
          {idleIcon ?? <Copy data-slot="idle-icon" />}
        </motion.span>
      ) : state === 'done' ? (
        <motion.span key="done" {...props}>
          {doneIcon ?? <Check data-slot="done-icon" />}
        </motion.span>
      ) : state === 'error' ? (
        <motion.span key="error" {...props}>
          {errorIcon ?? <CircleX data-slot="error-icon" />}
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
}

export type CopyButtonProps = ComponentProps<typeof Button> & {
  /** The text to copy, or a function that returns the text. */
  text: string | (() => string);
  /** Called with the copied text on successful copy. */
  onCopySuccess?: (text: string) => void;
  /** Called with the error if the copy operation fails. */
  onCopyError?: (error: Error) => void;
} & Omit<CopyStateIconProps, 'state'>;

export function CopyButton({
  size = 'icon',
  children,
  text,
  idleIcon,
  doneIcon,
  errorIcon,
  onClick,
  onCopySuccess,
  onCopyError,
  ...props
}: CopyButtonProps) {
  const { state, copy } = useCopyToClipboard({
    onCopySuccess,
    onCopyError,
  });

  return (
    <Button
      className="will-change-transform"
      size={size}
      onClick={(e) => {
        copy(text);
        onClick?.(e);
      }}
      aria-label="Copy"
      {...props}
    >
      <CopyStateIcon
        state={state}
        idleIcon={idleIcon}
        doneIcon={doneIcon}
        errorIcon={errorIcon}
      />
      {children}
    </Button>
  );
}
