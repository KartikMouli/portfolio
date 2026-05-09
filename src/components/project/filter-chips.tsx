'use client';

import { useMemo } from 'react';

import { getProjects } from '@/lib/data/projects';
import { useProjectsFilter } from '@/lib/store/projects-filter';
import { cn } from '@/lib/utils';

/**
 * Tags below this project count are excluded from the chip row — too
 * many one-off chips becomes visual noise. After tag normalization
 * (see `src/data/projects.json`), this leaves ~13 chips for the
 * current 12 projects.
 */
const MIN_PROJECT_COUNT = 2;

/**
 * Filter chips for the projects page. Single-select: clicking the
 * active chip clears the filter (equivalent to clicking "All").
 *
 * Tag list is computed at module load — `getProjects()` parses static
 * JSON, so the result is stable across renders. `useMemo` is belt-and-
 * suspenders against React Compiler; it's effectively free here.
 */
export function ProjectsFilterChips() {
  const selected = useProjectsFilter((s) => s.selectedTag);
  const setSelected = useProjectsFilter((s) => s.setSelectedTag);

  const tagCounts = useMemo(() => {
    const projects = getProjects();
    const counts = new Map<string, number>();
    for (const p of projects) {
      for (const tag of p.tags ?? []) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    // Sort by frequency desc, then alphabetically for stable order
    // among equal-count tags.
    return Array.from(counts.entries())
      .filter(([, c]) => c >= MIN_PROJECT_COUNT)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, []);

  const totalProjects = useMemo(() => getProjects().length, []);

  return (
    <div
      role="group"
      aria-label="Filter projects by tag"
      className="flex flex-wrap gap-2"
    >
      <Chip
        label="All"
        count={totalProjects}
        active={selected === null}
        onClick={() => setSelected(null)}
      />
      {tagCounts.map(([tag, count]) => (
        <Chip
          key={tag}
          label={tag}
          count={count}
          active={selected === tag}
          onClick={() => setSelected(selected === tag ? null : tag)}
        />
      ))}
    </div>
  );
}

interface ChipProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

function Chip({ label, count, active, onClick }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-background hover:bg-muted'
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          'tabular-nums',
          active ? 'text-primary-foreground/70' : 'text-muted-foreground'
        )}
      >
        {count}
      </span>
    </button>
  );
}
