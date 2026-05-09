# Authoring guide

Adding content to this site is just creating files. Sitemap entries, per-page OG images, JSON-LD, and (for blog posts) the RSS feed are all auto-derived from frontmatter — there is nothing else to update by hand.

Three content surfaces:

| Surface                             | Path                                               | Schema (in [`src/lib/schemas.ts`](src/lib/schemas.ts)) |
| ----------------------------------- | -------------------------------------------------- | ------------------------------------------------------ |
| **Project card** (`/projects`)      | [`src/data/projects.json`](src/data/projects.json) | `ProjectSchema`                                        |
| **Case study** (`/projects/[slug]`) | `src/content/case-studies/<slug>.mdx`              | `CaseStudyFrontmatterSchema`                           |
| **Blog post** (`/blog/[slug]`)      | `src/content/blog/<slug>.mdx`                      | `BlogFrontmatterSchema`                                |

## Add a project

Edit [`src/data/projects.json`](src/data/projects.json) — add an entry to the `projects` array:

```json
{
  "name": "MyProject",
  "description": "One sentence on what it is and why it matters.",
  "href": "https://my-project.example.com",
  "image": "/img/project/myproject.png",
  "tags": ["Next.js", "Postgres"],
  "links": [
    {
      "name": "Live Demo",
      "href": "https://my-project.example.com",
      "icon": "external-link"
    },
    {
      "name": "Source Code",
      "href": "https://github.com/.../myproject",
      "icon": "github"
    }
  ]
}
```

If the project also has a long-form write-up, add `"caseStudy": "<slug>"` — the card will render a `Read the case study →` link to `/projects/<slug>`.

Tag normalization matters: the [`/projects`](src/app/projects/page.tsx) tag filter dedupes via canonical names (`React`, not `ReactJS` / `React.js`). Use what's already in `projects.json`.

## Add a case study

Create `src/content/case-studies/<slug>.mdx`:

```yaml
---
slug: <slug> # must match filename
title: 'Headline'
summary: 'One sentence — used for OG/meta description.'
projectName: 'MyProject' # must match `name` in projects.json
publishedAt: '2026-05-09' # ISO yyyy-mm-dd
heroImage: '/img/...png' # optional
---
## Free-form MDX body
```

Auto-derived:

- Sticky table of contents from H2 / H3 headings (`lg:` and up)
- `Article` + `BreadcrumbList` JSON-LD on the page
- Per-case-study 1200×630 OG image (terminal-themed, pulled from frontmatter)
- Sitemap entry with `lastModified = publishedAt`
- Heading slugs match what `rehype-slug` produces, so `#section-name` deep-links work

MDX features available globally (wired in [`src/mdx-components.tsx`](src/mdx-components.tsx)):

- Standard markdown + GFM tables, task lists, autolinks
- Fenced code blocks with monospace styling
- **Mermaid diagrams** via ` ```mermaid ` fenced blocks — lazy-loaded, theme-synced (see [`src/components/case-study/mermaid.tsx`](src/components/case-study/mermaid.tsx))
- Inline links auto-detect external vs internal (external opens in new tab with safe `rel`)

## Add a blog post

Create `src/content/blog/<slug>.mdx`:

```yaml
---
slug: <slug> # must match filename
title: 'Headline'
summary: 'One sentence.'
publishedAt: '2026-05-09' # ISO yyyy-mm-dd
tags: ['react', 'mdx'] # drives the /blog tag filter
draft: true # see "Drafts" below
canonicalUrl: 'https://...' # rare — only if canonical is elsewhere
coverImage: '/img/...' # optional; overrides per-post OG image
---
```

Auto-derived:

- Tag filter on `/blog` (zustand-backed, single-select)
- `BlogPosting` + `BreadcrumbList` JSON-LD
- Per-post 1200×630 OG image (date · reading time · tags pulled from frontmatter)
- Sitemap entry
- RSS `<item>` in `/feed.xml`
- Reading time on the post header (~200 wpm)
- Inclusion in `/llms.txt` (top 10 latest)

### Drafts

Setting `draft: true`:

- **Dev** (`pnpm dev`): post surfaces on `/blog` with a `DRAFT` pill so you can preview at `/blog/<slug>`.
- **Production**: hidden from `/blog`, hidden from sitemap / RSS / JSON-LD / llms.txt; direct visit to `/blog/<slug>` 404s.

Flip to `draft: false` (or remove the line — defaults to `false`) to publish.

### Local preview workflow

```bash
pnpm dev
# visit http://localhost:3000/blog
# write, save, browser refreshes
# happy → flip `draft: false`, git push, Vercel deploys
```

## Cross-posting

Posts are canonical at `www.kartikmouli.me/blog/<slug>`. Cross-posts on dev.to / Medium link back via canonical URL — search engines treat your portfolio as the source.

### dev.to

Two paths:

- **Auto** (recommended): dev.to → Settings → Extensions → **Publish from RSS** → paste `https://www.kartikmouli.me/feed.xml`. Each new post imports as a draft with `canonical_url` already set. Review and publish in dev.to's editor.
- **Manual**: paste the post body into dev.to's editor; fill the **Canonical URL** field with `https://www.kartikmouli.me/blog/<slug>`.

### Medium

Manual paste only — Medium dropped auto-RSS imports for new accounts. When publishing, set "originally published at" to your portfolio post URL. Medium emits the right `<link rel="canonical">` automatically.

## Frontmatter reference

### Blog post (`BlogFrontmatterSchema`)

| Field          | Type                | Required | Notes                                                            |
| -------------- | ------------------- | -------- | ---------------------------------------------------------------- |
| `slug`         | string              | yes      | Must match filename                                              |
| `title`        | string              | yes      | Headline                                                         |
| `summary`      | string              | yes      | One-line; used for OG / meta description / RSS                   |
| `publishedAt`  | string (yyyy-mm-dd) | yes      | Sort order, sitemap, RSS pubDate                                 |
| `updatedAt`    | string (yyyy-mm-dd) | no       | Bump on a meaningful rewrite; surfaces in `dateModified` JSON-LD |
| `tags`         | string[]            | no       | Default `[]`; drives the tag filter; lower-case convention       |
| `draft`        | boolean             | no       | Default `false`; see [Drafts](#drafts)                           |
| `canonicalUrl` | URL                 | no       | Only when canonical lives elsewhere (rare)                       |
| `coverImage`   | string              | no       | Overrides per-post OG image                                      |

### Case study (`CaseStudyFrontmatterSchema`)

| Field         | Type                | Required | Notes                                |
| ------------- | ------------------- | -------- | ------------------------------------ |
| `slug`        | string              | yes      | Must match filename                  |
| `title`       | string              | yes      | Headline                             |
| `summary`     | string              | yes      | One-line summary                     |
| `projectName` | string              | yes      | Must match `name` in `projects.json` |
| `publishedAt` | string (yyyy-mm-dd) | yes      | Sitemap + JSON-LD                    |
| `heroImage`   | string              | no       | Optional hero                        |

## What you don't need to do

These are auto-derived from the files above. Don't try to update them by hand:

- [`src/app/sitemap.ts`](src/app/sitemap.ts) — reads from filesystem
- [`src/app/feed.xml/route.ts`](src/app/feed.xml/route.ts) — reads from filesystem
- [`src/app/llms.txt/route.ts`](src/app/llms.txt/route.ts) — reads from filesystem
- Any per-page OG image — generated from frontmatter
- Any per-page JSON-LD — generated from frontmatter

If you need to tighten any of these (e.g. exclude a specific post from the sitemap, or list more than 10 in llms.txt), edit the corresponding handler in `src/app/`. They're all small.

## Editor experience

`eslint-plugin-mdx` is wired into [`eslint.config.mjs`](eslint.config.mjs):

- VS Code → red squiggles on unclosed JSX, frontmatter typos, bad MDX syntax
- `git commit` → husky runs `prettier --write` then `eslint --fix` on staged `.mdx` files
- `pnpm lint` includes `.mdx` files in the full repo lint

Prettier 3 has a built-in MDX parser; no `prettier-plugin-mdx` is needed.
