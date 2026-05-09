import { siteConfig } from '@/config/site';
import { getAllPostMetas } from '@/lib/data/blog';

/**
 * `/llms.txt` — markdown index for LLM crawlers / AI assistants.
 *
 * Spec: https://llmstxt.org/
 *   1. H1 with project name (required).
 *   2. Blockquote summary.
 *   3. Free-form context paragraphs.
 *   4. H2 sections containing `[link](url): description` lists.
 *   5. Optional `## Optional` section for secondary resources.
 *
 * The route is generated from `siteConfig` so URL/role/name changes
 * propagate automatically. Content-Type is `text/plain; charset=utf-8`.
 *
 * No dynamic data source is read, so Next 16 with `cacheComponents` will
 * infer this as a static route automatically (no `dynamic` export needed —
 * setting one would conflict with cacheComponents mode).
 */

export function GET() {
  const { name, role, location } = siteConfig.author;
  const url = siteConfig.url;
  const links = siteConfig.links;

  // Latest published posts surfaced inline so an LLM crawler that only
  // reads `/llms.txt` still discovers writing without a second round-
  // trip to `/blog`. Capped at 10 to keep the file readable.
  const latestPosts = getAllPostMetas().slice(0, 10);
  const writingSection = latestPosts.length
    ? `\n## Writing\n\n${latestPosts
        .map(
          (p) =>
            `- [${p.title}](${url}/blog/${p.slug}) (${p.publishedAt}): ${p.summary}`
        )
        .join('\n')}\n`
    : '';

  const body = `# ${name}

> ${role} based in ${location}. Engineering full-stack web applications and AI platforms with React, Next.js, TypeScript, NestJS, and modern web technology.

This is ${name}'s personal portfolio at ${url}. ${siteConfig.description}

## Pages

- [Home](${url}/): Hero with role, location, and contact details; tech stack info; work experience timeline (Education + Experience); featured projects; GitHub contribution heatmap.
- [Projects](${url}/projects): Full list of projects with tech stack tags, live demos, and source links. Selected projects have long-form case studies under \`/projects/[slug]\`.
- [Blog](${url}/blog): Short posts on what I'm shipping, bugs that took two days, and whether tools were worth it. Cross-posted to dev.to and Medium with canonical URLs pointing back here.
- [Now](${url}/now): What I'm currently focused on.
- [Uses](${url}/uses): Hardware and software I use day-to-day.
- [Keys](${url}/keys): Keyboard shortcuts and discoverable URLs.
- [Contact](${url}/contact): Contact form and direct ways to reach out.
${writingSection}
## Profiles & code

- [GitHub](${links.github}): Open-source code, including this portfolio's source.
- [LinkedIn](${links.linkedin}): Professional profile.
- [LeetCode](${links.leetcode}): Competitive programming.
- [X / Twitter](${links.twitter})

## Optional

- [Resume](${links.resume}): Downloadable PDF resume.
- [Privacy Policy](${url}/privacy): Site privacy policy.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
