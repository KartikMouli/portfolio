import projectsData from '@/data/projects.json';
import { ProjectsSchema } from '@/lib/schemas';

export function getProjects() {
  return ProjectsSchema.parse(projectsData.projects);
}
