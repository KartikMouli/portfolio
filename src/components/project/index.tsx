import { getProjects } from '@/lib/data/projects';
import { ProjectCard } from './project-card';

interface Props {
  limit?: number;
}

export default function Projects({ limit }: Props) {
  const all = getProjects();
  const projects = limit === undefined ? all : all.slice(0, limit);

  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 px-1">
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
