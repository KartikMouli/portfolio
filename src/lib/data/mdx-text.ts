import 'server-only';

/**
 * Strip MDX / Markdown noise from a post body so the result is plain
 * prose suitable for the schema.org `articleBody` field on
 * `BlogPosting` / `Article` JSON-LD.
 *
 * Why bother: AI search engines (ChatGPT, Perplexity, Gemini grounding,
 * Bing Copilot) read JSON-LD. A populated `articleBody` lets them cite
 * the post with grounded text instead of guessing from headings, and
 * survives rendering changes that traditional scrapers trip on.
 *
 * What gets stripped:
 *   - ESM `import`/`export` lines (MDX scaffolding, never visible)
 *   - JSX/MDX components (`<Mermaid>…</Mermaid>`, `<Foo />`)
 *   - fenced code blocks (code isn't prose)
 *   - inline code, heading markers, emphasis, list bullets, blockquotes
 *   - markdown link/image syntax (preserves the visible text)
 *
 * Output is whitespace-collapsed and capped at `MAX_BODY_CHARS` so we
 * don't bloat every blog post HTML by 30+ KB on long-form pieces.
 * 5000 chars ≈ 800 words, plenty for an AI engine to extract intent.
 *
 * The regexes are intentionally simple — bulletproof MDX parsing would
 * mean shipping the actual MDX AST to the client. For the citation-
 * extract use case, "good-enough plain text" is the bar.
 */
const MAX_BODY_CHARS = 5000;

export function mdxToPlainText(mdx: string): string {
  return (
    mdx
      // ESM imports/exports — MDX-only, never reach the reader.
      .replace(/^\s*(?:import|export)\s+[\s\S]*?(?:;|\n)/gm, '')
      // Self-closing MDX components: <Foo />
      .replace(/<[A-Z][^>]*\/>/g, '')
      // Paired MDX components: <Foo>…</Foo>. Body-text inside is
      // typically prop config (e.g. <Mermaid> diagram source), not prose.
      .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][\w]*>/g, '')
      // Fenced code blocks — drop entirely; code samples aren't body text.
      .replace(/```[\s\S]*?```/g, '')
      // Inline code: `foo`
      .replace(/`[^`]*`/g, '')
      // Images: ![alt](src) → alt
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      // Links: [text](url) → text
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      // Heading markers (#, ##, ###, …). Append a period so the
      // heading reads as its own sentence once the surrounding
      // newlines collapse — "Why I built it. I travel a lot" beats
      // "Why I built it I travel a lot" for both human readability
      // and AI tokenization.
      .replace(/^#{1,6}\s+(.+?)\s*$/gm, '$1.')
      // List bullets / blockquote markers
      .replace(/^\s*[-*+]\s+/gm, '')
      .replace(/^\s*>\s?/gm, '')
      // Emphasis / strikethrough
      .replace(/[*_~]/g, '')
      // HTML entities → space (preserves token boundaries)
      .replace(/&[a-z#0-9]+;/gi, ' ')
      // Collapse whitespace and clip
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, MAX_BODY_CHARS)
  );
}
