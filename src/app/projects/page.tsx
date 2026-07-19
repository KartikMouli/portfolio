import type { Metadata } from 'next';

import { ProjectsFilterChips } from '@/components/project/filter-chips';
import { FilteredProjects } from '@/components/project/filtered-projects';
import { ProjectsListJsonLd } from '@/components/seo/projects-list-jsonld';
import { H1 } from '@/components/typography';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Projects',
  description: `A curated list of ${siteConfig.author.name}'s projects — production work, side projects, and proofs of concept built with React, Next.js, TypeScript, and friends.`,
  alternates: { canonical: `${siteConfig.url}/projects` },
  openGraph: {
    title: `Projects | ${siteConfig.author.name}`,
    // Was a truncated 8-word version of the page description; OG cards
    // get plenty of width on Twitter/LinkedIn/Discord so let the full
    // line through and keep the keyword density consistent with what
    // <meta name="description"> ships.
    description: `A curated list of ${siteConfig.author.name}'s projects — production work, side projects, and proofs of concept built with React, Next.js, TypeScript, and friends.`,
    type: 'website',
    url: `${siteConfig.url}/projects`,
  },
};

export default function ProjectsPage() {
  return (
    <div className="mt-8 flex flex-col gap-6 pb-16">
      <ProjectsListJsonLd />
      <H1>My projects</H1>
      <ProjectsFilterChips />
      <FilteredProjects />
    </div>
  );
}
