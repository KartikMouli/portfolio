# Portfolio — kartikmouli.me

A personal site. Showcases projects, work history, certifications, GitHub contributions, open-source patches, and a Gemini-powered chatbot grounded on my bio + FAQ.

Live: <https://kartikmouli.me>

## Tech stack

- **Framework**: Next.js 16 (App Router, React Compiler, `cacheComponents`)
- **UI**: Tailwind CSS 4, shadcn/ui (Radix primitives), tw-shimmer, framer-motion
- **Fonts**: Inter, Playfair Display, JetBrains Mono (via `next/font`)
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
│   │   ├── (routes)/      # home, projects, blog, contact, privacy, …
│   │   ├── api/chat/      # Gemini streaming endpoint
│   │   ├── llms.txt/      # AI-readable site overview
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── assistant-ui/  # registry-based chat modal (Gemini-backed)
│   │   ├── chat/          # runtime provider for the chatbot
│   │   ├── home/          # hero + tagline animation
│   │   ├── contributions/ # OSS contributions section
│   │   ├── project/       # project cards
│   │   ├── timeline/      # work + education
│   │   └── ui/            # shadcn primitives
│   ├── content/           # MD: bio, faq, tech-philosophy (chatbot context)
│   ├── data/              # JSON: projects, contributions, certs, …
│   ├── lib/               # utils, schemas, data loaders, same-origin guard
│   └── env.ts             # zod-validated env boundary
├── .env.example
└── next.config.js
```
