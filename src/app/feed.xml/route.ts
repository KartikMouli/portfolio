import { siteConfig } from '@/config/site';
import { getAllPostMetas } from '@/lib/data/blog';

/**
 * RSS 2.0 feed for the blog at `/feed.xml`.
 *
 * Cross-posting model: this is what dev.to's "publish via RSS"
 * feature subscribes to. dev.to imports each `<item>` as an unpublished
 * draft, copying the canonical URL into its `canonical_url` field
 * automatically — your portfolio stays the canonical source for
 * search engines while reaching dev.to's audience.
 *
 * Medium dropped auto-RSS imports for new accounts, so cross-posts
 * there are still a manual paste; this feed remains useful for any
 * generic RSS reader.
 *
 * Drafts are filtered out by `getAllPostMetas` so subscribers never
 * see in-progress writing.
 *
 * Spec: https://www.rssboard.org/rss-specification
 * Atom self-link: included via `xmlns:atom` so feed validators stop
 * complaining about missing autodiscovery.
 */
export function GET() {
  const url = siteConfig.url;
  const posts = getAllPostMetas();
  const lastBuildDate = new Date().toUTCString();
  const channelDate =
    posts.length > 0 && posts[0]!.publishedAt
      ? new Date(posts[0]!.publishedAt).toUTCString()
      : lastBuildDate;

  const items = posts
    .map((post) => {
      const link = `${url}/blog/${post.slug}`;
      const pubDate = post.publishedAt
        ? new Date(post.publishedAt).toUTCString()
        : lastBuildDate;
      const categories = post.tags
        .map((t) => `<category>${escapeXml(t)}</category>`)
        .join('');
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(post.summary)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${siteConfig.author.email} (${escapeXml(siteConfig.author.name)})</author>
      ${categories}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
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
