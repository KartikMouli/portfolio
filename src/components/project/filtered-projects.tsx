'use client';

import { useMemo } from 'react';

import { getProjects } from '@/lib/data/projects';
import { ProjectCard } from '@/components/project/project-card';
import { useProjectsFilter } from '@/lib/store/projects-filter';

/**
 * `/projects` page grid. Reads the selected tag from the zustand store
 * and filters in-memory. The data parse runs once per render; with the
 * tiny static dataset (12 projects) this is microsecond-fast and
 * doesn't warrant memoization beyond the obvious.
 *
 * Server-rendered home featured grid (`<Projects limit={2} />`)
 * deliberately bypasses this — the filter is a /projects-page concern.
 */
export function FilteredProjects() {
  const selected = useProjectsFilter((s) => s.selectedTag);

  const projects = useMemo(() => {
    const all = getProjects();
    if (!selected) return all;
    return all.filter((p) => p.tags?.includes(selected));
  }, [selected]);

  if (projects.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-muted-foreground/30 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No projects tagged{' '}
          <span className="font-mono text-foreground">{selected}</span>.
        </p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-6 px-1 sm:grid-cols-2">
      {projects.map((project) => (
        <div
          key={project.href ?? project.name}
          className="hover:cursor-pointer"
        >
          <ProjectCard project={project} />
        </div>
      ))}
    </section>
  );
}
