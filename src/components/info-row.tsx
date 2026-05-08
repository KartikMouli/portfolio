import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * A single icon + value row used in the home hero info grid.
 *
 * The icon sits in a small rounded-lg muted box that mirrors the
 * position-icon container used by `<WorkExperience />` further down
 * the page, so the hero and the timeline visually echo each other.
 */
interface InfoRowProps {
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

export function InfoRow({ icon, children, className }: InfoRowProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 text-sm text-muted-foreground',
        className
      )}
    >
      <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-muted-foreground/15 bg-muted text-muted-foreground [&_svg]:size-3.5">
        {icon}
      </span>
      <span className="min-w-0 truncate">{children}</span>
    </div>
  );
}
