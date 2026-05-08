import { ProjectsFilterChips } from '@/components/project/filter-chips';
import { FilteredProjects } from '@/components/project/filtered-projects';
import { H1 } from '@/components/typography';

export default function ProjectsPage() {
  return (
    <div className="mt-8 flex flex-col gap-6 pb-16">
      <H1>My projects</H1>
      <ProjectsFilterChips />
      <FilteredProjects />
    </div>
  );
}
