import createMDX from '@next/mdx';

// Comma-separated LAN origins (read from `.env.local`) so devs can test
// on real phones over Wi-Fi without Next 16 blocking the requests as
// cross-origin. Each developer sets their own IP — the var is empty by
// default so nothing is shipped, and the `allowedDevOrigins` key is
// only emitted when at least one entry is present. See `.env.example`
// for the variable name + how to find your LAN IP.
const devOrigins = process.env.NEXT_DEV_ALLOWED_ORIGINS?.split(',')
  .map((s) => s.trim())
  .filter(Boolean);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  // `mdx` extension makes `.mdx` files importable as React components
  // (and routable inside `app/` if ever needed). The default
  // ['js','jsx','ts','tsx'] still applies; we just append.
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  ...(devOrigins?.length ? { allowedDevOrigins: devOrigins } : {}),
};

// MDX pipeline. Plugin names are passed as **strings** (not function
// imports) — Turbopack can't serialize JS function references across
// its Rust boundary, so `next.config` must use string names. The
// matching packages are installed; Next resolves them at build time.
//
// Plugin chain:
//   - remark-gfm: tables, strikethrough, autolinks, task lists
//   - remark-frontmatter + remark-mdx-frontmatter: parse the YAML
//     frontmatter block at the top of each .mdx file and expose it
//     as `export const frontmatter` on the compiled module.
//   - rehype-slug: id="…" on every heading
//   - rehype-autolink-headings: wrap each heading text in an `<a>`
//     pointing to its own slug — enables deep-linking to sections
//     and powers any future TOC.
const withMDX = createMDX({
  options: {
    remarkPlugins: [
      'remark-gfm',
      'remark-frontmatter',
      ['remark-mdx-frontmatter', { name: 'frontmatter' }],
    ],
    rehypePlugins: [
      'rehype-slug',
      ['rehype-autolink-headings', { behavior: 'wrap' }],
    ],
  },
});

export default withMDX(nextConfig);
