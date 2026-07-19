# Portfolio — kartikmouli.me

A personal site. Showcases projects, work history, certifications, GitHub contributions, open-source patches, and a Gemini-powered chatbot grounded on my bio + FAQ.

Live: <https://www.kartikmouli.me>

## Tech stack

- **Framework**: Next.js 16 (App Router, React Compiler, `cacheComponents`)
- **UI**: Tailwind CSS 4, shadcn/ui (Radix primitives), tw-shimmer, framer-motion
- **Fonts**: Inter, Playfair Display, JetBrains Mono (via `next/font`)
- **MDX**: `@next/mdx` + remark-gfm/frontmatter/mdx-frontmatter + rehype-slug/autolink-headings — drives case studies and blog posts
- **Diagrams**: Mermaid (lazy-loaded client renderer, theme-synced)
- **State**: Zustand for filter UIs (projects + blog tag chips)
- **RSS**: hand-rolled `/feed.xml` for cross-posting to dev.to / Medium
- **AI**: Vercel AI SDK 6 + `@ai-sdk/google` (Gemini 2.5 Flash), surfaced via `assistant-ui`
- **Email**: Resend (contact form via Server Action)
- **Validation**: zod 4 (typed env, form schemas, request guards)
- **Deploy**: Vercel

## Local dev

Prereqs: Node 22+, pnpm.

```bash
pnpm install
cp .env.example .env.local        # then fill in the keys you need
pnpm dev
```

Open <http://localhost:3000>.

### Environment variables

All env vars are validated at module load via [`src/env.ts`](src/env.ts). The full list lives in [`.env.example`](.env.example):

| Variable                       | What it powers                           | Optional? |
| ------------------------------ | ---------------------------------------- | --------- |
| `RESEND_API_KEY`               | Contact form sending                     | Yes\*     |
| `GOOGLE_GENERATIVE_AI_API_KEY` | `/api/chat` (Gemini)                     | Yes\*     |
| `GOOGLE_VERIFICATION_CODE`     | Google Search Console verification       | Yes       |
| `NEXT_DEV_ALLOWED_ORIGINS`     | LAN testing on a phone (`<LAN_IP>:3000`) | Dev-only  |

\* Optional in the schema so `pnpm build` works in CI without secrets, but **production must set them** — the contact form throws at send-time and `/api/chat` returns 500 without the corresponding key.

### Other commands

```bash
pnpm lint                # eslint
pnpm format              # prettier
pnpm build               # production build
pnpm exec tsc --noEmit   # type-check
```

CI runs lint + tsc + build on every push (see [`.github/workflows/ci.yml`](.github/workflows/ci.yml)).

## Authoring content

The two MDX-driven content surfaces are case studies (`src/content/case-studies/`) and blog posts (`src/content/blog/`). Sitemap, per-page OG images, JSON-LD, and (for posts) the RSS feed are all auto-derived from frontmatter — adding a file is the whole flow.

**Add a blog post** — create `src/content/blog/<slug>.mdx`:

```yaml
---
slug: <slug>
title: 'Headline'
summary: 'One sentence.'
publishedAt: '2026-05-09'
tags: ['react', 'mdx']
draft: true
---
```

`pnpm dev` → drafts surface on `/blog` with a `DRAFT` pill so you can preview at `/blog/<slug>`. Flip `draft: false`, push, deploy.

**Cross-posting** — posts are canonical on this site. dev.to → Settings → Extensions → "Publish from RSS" → `https://www.kartikmouli.me/feed.xml` to auto-import each new post (canonical URL is set automatically). Medium needs manual paste; set "originally published at" to your portfolio URL.

Full reference (case-study frontmatter, complete frontmatter cheat sheet, draft semantics, what's auto-derived) lives in [AUTHORING.md](AUTHORING.md).

## Deploy

1. Import the repo into Vercel.
2. Add env vars in Vercel project settings — at minimum `RESEND_API_KEY` and `GOOGLE_GENERATIVE_AI_API_KEY` for production.
3. Default Next.js build settings; the `main` branch deploys to production, PRs get preview URLs automatically.

## Project structure

```text
.
├── public/                # static assets, OG images, project screenshots
├── src/
│   ├── app/
│   │   ├── (routes)/      # home, projects (+ [slug] case studies), blog (+ [slug] posts), now, uses, keys, contact, privacy
│   │   ├── api/chat/      # Gemini streaming endpoint
│   │   ├── feed.xml/      # RSS feed (autodiscovered + cross-posting source for dev.to)
│   │   ├── llms.txt/      # AI-readable site overview
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── assistant-ui/  # registry-based chat modal (Gemini-backed)
│   │   ├── blog/          # list cards, tag chips, filter
│   │   ├── case-study/    # sticky TOC, lazy-loaded Mermaid renderer
│   │   ├── chat/          # runtime provider for the chatbot
│   │   ├── home/          # hero + section rail + tagline animation
│   │   ├── contributions/ # OSS contributions section
│   │   ├── project/       # project cards + filter chips
│   │   ├── seo/           # JSON-LD components (Person, Article, ItemList, Breadcrumb)
│   │   ├── timeline/      # work + education
│   │   └── ui/            # shadcn primitives
│   ├── content/
│   │   ├── blog/          # MDX blog posts
│   │   └── case-studies/  # MDX long-form project write-ups
│   ├── data/              # JSON: projects, contributions, certs, …
│   ├── lib/               # utils, schemas, data loaders, zustand stores, hooks, same-origin guard
│   └── env.ts             # zod-validated env boundary
├── .env.example
├── AUTHORING.md           # how to add projects, case studies, blog posts
└── next.config.js
```
