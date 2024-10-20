import data from "@/data/projects.json";

import { ProjectCard } from "./ui/ProjectCard";

interface Props {
    limit?: number;
}

export default function Projects({ limit }: Props) {
    let projects = data.projects;
    if (limit) {
        projects = projects.slice(0, limit);
    }

    return (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            
            {projects.map((project, id) => (
                <ProjectCard key={id} project={project} />
            ))}
        </section>
    );
}