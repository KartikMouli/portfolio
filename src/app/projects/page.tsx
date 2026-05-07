import Projects from '@/components/project';
import { H1 } from '@/components/typography';

export default function ProjectsPage() {
  return (
    <div className="mt-8 flex flex-col gap-8 pb-16">
      <H1>My projects</H1>
      <Projects />
    </div>
  );
}
