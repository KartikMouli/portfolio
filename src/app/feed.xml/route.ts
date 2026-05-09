import { marked } from 'marked';

import { siteConfig } from '@/config/site';
import { getAllPostMetas, getPostBody } from '@/lib/data/blog';

// GFM is on by default in marked v15+, but pinned explicitly so a
// future major isn't a silent regression for posts that use tables /
// task lists / strikethrough. `breaks: false` matches CommonMark — a
// single newline inside a paragraph is whitespace, not <br>.
marked.use({ gfm: true, breaks: false });

/**
 * RSS 2.0 feed for the blog at `/feed.xml`.
 *
 * Cross-posting model: this is what dev.to's "publish via RSS"
 * feature subscribes to. dev.to imports each `<item>` as an
 * unpublished draft and uses the `<link>` element as `canonical_url`
 * (when "Mark the RSS source as canonical URL by default" is enabled
 * in their RSS settings) — your portfolio stays the canonical source
 * for search engines while reaching dev.to's audience.
 *
 * dev.to's content-element priority is documented as
 *   1. `<content>` (Atom)
 *   2. `<summary>` (Atom)
 *   3. `<description>` (RSS)
 *   ...with `<content:encoded>` recognised as a separate HTML body.
 * They convert HTML → Markdown for storage; raw markdown shoved into
 * `<content:encoded>` would render as a literal-text paragraph, so
 * we compile each post's body through `marked` before emitting.
 *
 * Spec: https://www.rssboard.org/rss-specification · RSS Content
 * module: http://web.resource.org/rss/1.0/modules/content/ · dev.to
 * import guide: https://dev.to/p/publishing_from_rss_guide.
 *
 * Drafts are filtered out by `getAllPostMetas` so subscribers never
 * see in-progress writing.
 */
export async function GET() {
  const url = siteConfig.url;
  const posts = getAllPostMetas();
  const lastBuildDate = new Date().toUTCString();
  const channelDate =
    posts.length > 0 && posts[0]!.publishedAt
      ? new Date(posts[0]!.publishedAt).toUTCString()
      : lastBuildDate;

  const items = (
    await Promise.all(
      posts.map(async (post) => {
        const link = `${url}/blog/${post.slug}`;
        const pubDate = post.publishedAt
          ? new Date(post.publishedAt).toUTCString()
          : lastBuildDate;
        const categories = post.tags
          .map((t) => `<category>${escapeXml(t)}</category>`)
          .join('');
        // Compile the post body to HTML before emitting. dev.to's
        // RSS importer reads `<content:encoded>` as HTML and converts
        // it to Markdown for storage — sending raw markdown here
        // would land as a single literal-text paragraph instead of
        // a structured post.
        //
        // CDATA-wrap so HTML's `<` / `&` survive the XML parse
        // verbatim; the `]]>` escape splits any literal close-CDATA
        // token in user prose so the section stays valid XML.
        const html = await marked.parse(getPostBody(post.slug));
        const safeHtml = html.replace(/\]\]>/g, ']]]]><![CDATA[>');
        return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(post.summary)}</description>
      <content:encoded><![CDATA[${safeHtml}]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
      <author>${siteConfig.author.email} (${escapeXml(siteConfig.author.name)})</author>
      ${categories}
    </item>`;
      })
    )
  ).join('\n');

  // `xmlns:content` declares the RSS Content module so we can emit
  // `<content:encoded>` on each item. Standard module since 2002,
  // recognised by every mature feed reader + dev.to / Medium import.
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteConfig.author.name)} — Writing</title>
    <link>${url}/blog</link>
    <atom:link href="${url}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(`Notes from ${siteConfig.author.name} — what I'm shipping, what broke, what was worth it.`)}</description>
    <language>${siteConfig.language}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${channelDate}</pubDate>
    <generator>kartikmouli.me</generator>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      // 1-hour cache lets dev.to / RSS readers refresh without
      // hitting the route on every poll. Vercel's edge cache will
      // honour this for static-rendered output too.
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

/**
 * Minimal XML entity escaper — RSS bodies inside `<description>` /
 * `<title>` aren't interpreted as HTML by readers, but unescaped
 * `&`/`<`/`>` will break the parse. We deliberately don't escape
 * apostrophe or quote — they're allowed inside element content per
 * the XML spec, and skipping them keeps prose readable in raw view.
 */
function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
