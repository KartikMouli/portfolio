import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';

import { Mermaid } from '@/components/case-study/mermaid';
import { H1, H2, H3, H4, List, P } from '@/components/typography';
import { cn } from '@/lib/utils';

/**
 * Global MDX component overrides. **Required** by `@next/mdx` with the
 * App Router — without this file (and the `useMDXComponents` export
 * below), MDX imports throw at build time.
 *
 * Maps plain markdown elements to the project's typography primitives
 * so case-study prose looks like the rest of the site (same letter-
 * spacing, same heading scale, same inline-code chip). Headings get
 * `id="…"` from `rehype-slug` automatically; we don't strip it.
 *
 * The `code` mapping has to distinguish inline code (`foo`) from
 * fenced blocks (```js …```). Markdown's parser tags fenced blocks
 * with a `language-*` class; inline code has none. Without the split,
 * multi-line blocks would inherit the inline-code chip styling.
 */
const components: MDXComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  p: P,
  ul: List,
  code: ({ children, className, ...rest }) => {
    // Fenced ```mermaid blocks are diagrams, not code listings —
    // intercept them and render through the lazy-loaded <Mermaid>
    // component instead of a <code> element. The `<pre>` wrapper
    // around this would still apply, so we have to also handle that
    // case below; the `pre` mapping forwards through unchanged when
    // the only child is the Mermaid output.
    if (className === 'language-mermaid') {
      return <Mermaid chart={String(children).trim()} />;
    }
    if (className?.startsWith('language-')) {
      return (
        <code className={cn('font-mono text-sm', className)} {...rest}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
        {...rest}
      >
        {children}
      </code>
    );
  },
  pre: ({ children, ...rest }) => (
    // `leading-[1.1]` is intentional: monospace box-drawing characters
    // (┌ ─ ┐ │ └ ┘ ┬) only render as continuous lines when line-height
    // is at or below ~110% — `leading-relaxed` (162.5%) leaves visible
    // vertical gaps. See https://github.com/be5invis/Iosevka/issues/227.
    // Explicit `font-mono` so the JetBrains Mono `--font-mono` is used
    // rather than whatever the parent cascade defaults to.
    <pre
      className="my-4 overflow-x-auto rounded-md border border-border/50 bg-muted/30 p-4 font-mono text-sm leading-[1.1]"
      {...rest}
    >
      {children}
    </pre>
  ),
  // Internal hrefs use Next's client-side routing transparently;
  // external hrefs open in a new tab with safe rel attrs.
  a: ({ href, children, ...rest }) => {
    const isExternal =
      href?.startsWith('http://') || href?.startsWith('https://');
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline underline-offset-4 hover:text-muted-foreground"
          {...rest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href ?? '#'}
        className="font-medium underline underline-offset-4 hover:text-muted-foreground"
      >
        {children}
      </Link>
    );
  },
};

export function useMDXComponents(): MDXComponents {
  return components;
}
