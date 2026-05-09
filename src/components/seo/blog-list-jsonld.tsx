import { getAllPostMetas } from '@/lib/data/blog';
import { siteConfig } from '@/config/site';

/**
 * Structured data for `/blog`. Two schemas:
 *
 *   - `BreadcrumbList` — `Home → Writing` trail. Google uses this for
 *     the URL crumbs in the SERP listing.
 *   - `ItemList` — every published post as a positioned list item with
 *     its in-site URL. Helps the page rank for "<author> blog" queries
 *     by giving Google a parseable list of writing instead of an
 *     opaque DOM blob.
 *
 * Drafts are excluded by `getAllPostMetas` automatically. The layout's
 * `<JsonLd />` still emits site-wide `Person` + `WebSite` schemas, so
 * this component only adds what's page-specific.
 *
 * Mirror of `<ProjectsListJsonLd />` — same shape, same priorities.
 */
export function BlogListJsonLd() {
  const posts = getAllPostMetas();

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
        name: 'Writing',
        item: `${siteConfig.url}/blog`,
      },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${siteConfig.author.name}'s writing`,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: posts.length,
    itemListElement: posts.map((post, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: post.title,
      url: `${siteConfig.url}/blog/${post.slug}`,
      description: post.summary,
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
