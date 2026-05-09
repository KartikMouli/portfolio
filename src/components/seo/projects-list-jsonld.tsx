import projectsData from '@/data/projects.json';
import { ProjectsSchema } from '@/lib/schemas';
import { siteConfig } from '@/config/site';

/**
 * Structured data for `/projects`. Two schemas:
 *
 *   - `BreadcrumbList` — `Home → Projects` trail. Google uses this for
 *     the URL crumbs in the SERP listing.
 *   - `ItemList` — every project as a positioned list item with its
 *     external `href` (the live project URL) when available, falling
 *     back to the in-site case-study URL. Helps the page rank for
 *     "<author> projects" queries by giving Google a parseable list
 *     instead of just an opaque DOM blob.
 *
 * Re-validates `projects.json` against `ProjectsSchema` so a typo in
 * the data file fails at build time rather than producing malformed
 * JSON-LD that bots silently ignore.
 */
export function ProjectsListJsonLd() {
  const projects = ProjectsSchema.parse(projectsData.projects);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Projects',
        item: `${siteConfig.url}/projects`,
      },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${siteConfig.author.name}'s projects`,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: projects.length,
    itemListElement: projects.map((project, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: project.name,
      // Prefer the live URL (where the project actually lives); fall
      // back to the in-site case-study page; final fallback to the
      // /projects index URL itself.
      url:
        project.href ??
        (project.caseStudy
          ? `${siteConfig.url}/projects/${project.caseStudy}`
          : `${siteConfig.url}/projects`),
      description: project.description,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
    </>
  );
}
