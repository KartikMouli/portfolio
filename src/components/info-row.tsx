import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * A single icon + value row used in the home hero info grid.
 * Extracted from `home.tsx` so the hero file stays focused on layout
 * rather than primitive components, and so the row can be reused
 * (e.g. on a future About page).
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
      <span className="text-muted-foreground/70 [&_svg]:size-4">{icon}</span>
      <span className="min-w-0 truncate">{children}</span>
    </div>
  );
}
