import { siteConfig } from '@/config/site';

interface Props {
  /** Visible name of the leaf page (e.g. "Now", "Uses", "Contact"). */
  name: string;
  /** Path from site root with leading slash, no trailing (e.g. "/now"). */
  path: string;
}

/**
 * Single-level `BreadcrumbList` (`Home → <Page>`) for flat top-level
 * routes. Nested routes (`/blog/[slug]`, `/projects/[slug]`) emit
 * three-level breadcrumbs from their own dedicated JSON-LD components
 * (`BlogJsonLd`, `CaseStudyJsonLd`).
 *
 * Why bother on flat pages: Google sometimes shows breadcrumb chips in
 * the SERP even for non-listing routes, and the marginal cost is
 * ~120 bytes of inline JSON per page — negligible. It also makes the
 * site's navigation graph fully machine-readable, which AI search
 * engines (ChatGPT, Perplexity) traverse to understand site structure.
 *
 * The site-wide `Person` + `WebSite` schemas are still emitted from the
 * layout's `<JsonLd />`, so this component only adds breadcrumbs.
 */
export function BreadcrumbJsonLd({ name, path }: Props) {
  const schema = {
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
        name,
        item: `${siteConfig.url}${path}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
