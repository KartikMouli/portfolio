'use client';

import { format } from 'date-fns';
import { use, useEffect, useRef, useState, type CSSProperties } from 'react';

import { Spinner } from '@/components/ui/spinner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Activity } from '@/components/contribution-graph';
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from '@/components/contribution-graph';

export function GitHubContributions({
  contributions,
  githubProfileUrl,
}: {
  contributions: Promise<Activity[]>;
  githubProfileUrl: string;
}) {
  const data = use(contributions);

  // Reveal on scroll-into-view: a single IntersectionObserver toggles
  // `data-revealed` on the wrapper, then CSS animates each cell with a
  // per-column delay (see globals.css → `.contrib-cell` / `@keyframes
  // contrib-cell-in`). This keeps all animation work in CSS — no
  // per-cell motion components for ~365 cells. Plays once per page load
  // (observer disconnects on first intersection).
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || revealed) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [revealed]);

  return (
    <div ref={wrapperRef} data-revealed={revealed || undefined}>
      <ContributionGraph
        className="mx-auto py-2"
        data={data}
        blockSize={11}
        blockMargin={3}
        blockRadius={2}
      >
        <ContributionGraphCalendar
          className="no-scrollbar px-2"
          title="GitHub Contributions"
        >
          {({ activity, dayIndex, weekIndex }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                {/* `--week-idx` drives the staggered fade delay in CSS.
                    Cast through CSSProperties because TS doesn't know
                    about CSS custom properties on the `style` prop. */}
                <g
                  className="contrib-cell"
                  style={{ '--week-idx': weekIndex } as CSSProperties}
                >
                  <ContributionGraphBlock
                    activity={activity}
                    dayIndex={dayIndex}
                    weekIndex={weekIndex}
                  />
                </g>
              </TooltipTrigger>
              <TooltipContent className="font-sans">
                <p>
                  {activity.count} contribution
                  {activity.count > 1 ? 's' : null} on{' '}
                  {format(new Date(activity.date), 'dd.MM.yyyy')}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </ContributionGraphCalendar>

        <ContributionGraphFooter className="px-2">
          <ContributionGraphTotalCount>
            {({ totalCount, year }) => (
              <div className="text-muted-foreground">
                {totalCount.toLocaleString('en')} contributions in {year} on{' '}
                <a
                  className="text-foreground link-underline"
                  href={githubProfileUrl}
                  target="_blank"
                  rel="noopener"
                >
                  GitHub
                </a>
                .
              </div>
            )}
          </ContributionGraphTotalCount>

          <ContributionGraphLegend />
        </ContributionGraphFooter>
      </ContributionGraph>
    </div>
  );
}

export function GitHubContributionsFallback() {
  return (
    <div className="flex h-40.5 w-full items-center justify-center">
      <Spinner className="text-muted-foreground" />
    </div>
  );
}
