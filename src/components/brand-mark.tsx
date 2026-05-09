import { cn } from '@/lib/utils';

/**
 * Brand mark — terminal `>km_` glyph used in the navbar and anywhere
 * the brand needs to appear inline. Mirrors the favicon at `app/icon.svg`
 * and the apple-icon / OG card, but theme-aware: the rounded square fills
 * with `--foreground` (dark in light mode, cream in dark mode) so it
 * always contrasts against the page background.
 *
 * Pair with text → pass `aria-hidden`; use solo → leave it for the default
 * `role="img"` + label so screen readers announce it.
 */
interface BrandMarkProps {
  /** Icon dimension in px. Defaults to 24. */
  size?: number;
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}

const COPPER = '#A65A2E';

export function BrandMark({
  size = 24,
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
}: BrandMarkProps) {
  const a11y = ariaHidden
    ? ({ 'aria-hidden': true } as const)
    : ({ role: 'img', 'aria-label': ariaLabel ?? 'Kartik Mouli' } as const);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      {...a11y}
    >
      <rect width="256" height="256" rx="56" className="fill-foreground" />
      <text
        x="128"
        y="132"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-mono), ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
        fontSize="86"
        fontWeight={700}
        letterSpacing="-2"
      >
        <tspan style={{ fill: COPPER }}>{'>'}</tspan>
        <tspan className="fill-background">km_</tspan>
      </text>
    </svg>
  );
}
