'use client';

import data from '@/data/projects.json';
import { ProjectCard } from './project-card';

interface Props {
  limit?: number;
}

export default function Projects({ limit }: Props) {
  let projects = data.projects;
  if (limit) {
    projects = projects.slice(0, limit);
  }

  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 px-1">
      {projects.map((project, id) => (
        <div
          key={id}
          className="hover:cursor-pointer hover:scale-105 transition-all duration-300"
        >
          <ProjectCard project={project} />
        </div>
      ))}
    </section>
  );
}
