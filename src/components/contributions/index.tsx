'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { ArrowUpRight, ChevronDown } from 'lucide-react';

import { H2 } from '@/components/typography';
import { getContributions } from '@/lib/data/contributions';
import { cn } from '@/lib/utils';

/**
 * Number of repo-groups shown by default. We cap by **repo group**
 * (not by PR count) so a single repo's PRs always render together —
 * splitting them across visible/hidden looks odd and makes the section
 * feel arbitrary.
 */
const INITIAL_GROUPS_VISIBLE = 2;

/**
 * Run grouping at module load — the JSON is static so it never needs
 * to recompute on re-render. Pulling this out of the component body
 * also keeps the render itself trivially small.
 */
const CONTRIBUTIONS = getContributions();
const GROUPED = CONTRIBUTIONS.reduce<Record<string, typeof CONTRIBUTIONS>>(
  (acc, c) => {
    (acc[c.repo] ||= []).push(c);
    return acc;
  },
  {}
);
const ALL_GROUPS = Object.entries(GROUPED);

/**
 * "Open Source" home-page section — hand-curated list of pull requests
 * the author has shipped to third-party repos.
 *
 * Data lives in `src/data/contributions.json` (validated via
 * `ContributionsSchema`). Layout is grouped per repo: a repo header
 * link followed by its PRs. This deduplicates the repo name and tells
 * a more coherent story than a flat list when multiple PRs land in the
 * same project.
 *
 * Client component because of the "Show all" toggle. The data itself
 * is static so all of the parsing/grouping happens once at module
 * load (see consts above).
 */
export default function Contributions() {
  const [expanded, setExpanded] = useState(false);

  const visibleGroups = expanded
    ? ALL_GROUPS
    : ALL_GROUPS.slice(0, INITIAL_GROUPS_VISIBLE);
  // Overflow means there are groups beyond the initial cap; the toggle
  // is rendered iff true, regardless of current expand state.
  const hasOverflow = ALL_GROUPS.length > INITIAL_GROUPS_VISIBLE;

  return (
    <section className="flex flex-col gap-4">
      <H2 className="border-b-2 pb-3">Open Source</H2>
      <p className="text-sm text-muted-foreground">
        Patches I&apos;ve shipped — bug fixes, small features, occasional
        drive-bys.
      </p>
      <ul className="flex flex-col gap-5">
        {visibleGroups.map(([repo, prs]) => (
          <li key={repo} className="flex flex-col gap-2">
            <Link
              href={`https://github.com/${repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-fit items-center gap-1 text-sm font-semibold"
            >
              <span className="font-mono">{repo}</span>
              <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <ul className="flex flex-col">
              {prs.map((pr) => (
                <li key={pr.url}>
                  <Link
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    // Negative `-mx-2` so the hover background extends
                    // a bit past the text bounds without pushing the
                    // section's content margins.
                    className="-mx-2 flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted"
                  >
                    <StatePill state={pr.state} />
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">
                      #{pr.prNumber}
                    </span>
                    <span className="flex-1 truncate text-sm">{pr.title}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {format(parseISO(pr.date), 'MMM yyyy')}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      {hasOverflow && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          // `self-start` so the button hugs the left edge instead of
          // stretching to the section width. The chevron rotates 180°
          // on expand so its direction always matches what the click
          // will do (down = reveal more, up = collapse).
          className="group inline-flex w-fit items-center gap-1.5 self-start text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {expanded ? 'Show less' : `Show all ${CONTRIBUTIONS.length}`}
          <ChevronDown
            className={cn(
              'size-3.5 transition-transform',
              expanded && 'rotate-180'
            )}
          />
        </button>
      )}
    </section>
  );
}

/**
 * Small status badge mirroring GitHub's own PR-state colors:
 *   green = open, purple = merged, red = closed (rejected).
 * Background + border use the same hue at low alpha so it reads as a
 * pill against any theme background.
 */
function StatePill({ state }: { state: 'open' | 'merged' | 'closed' }) {
  const styles: Record<typeof state, string> = {
    open: 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400',
    merged:
      'border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-400',
    closed: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400',
  };
  const label = state.charAt(0).toUpperCase() + state.slice(1);
  return (
    <span
      className={cn(
        'inline-flex shrink-0 rounded-full border px-2 py-0.5 font-medium text-[10px]',
        styles[state]
      )}
    >
      {label}
    </span>
  );
}
