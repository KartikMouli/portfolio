import { siteConfig } from '@/config/site';

/**
 * Home-page-only structured data. `ProfilePage` declares that this
 * URL's `mainEntity` is the Person — true on `/`, misleading anywhere
 * else (which is why this is split out from the layout-level
 * `<JsonLd />` that emits `Person` + `WebSite` globally).
 *
 * Rendered from `src/app/page.tsx`.
 */
export function HomeJsonLd() {
  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: siteConfig.url,
    mainEntity: {
      '@type': 'Person',
      name: siteConfig.author.name,
      jobTitle: siteConfig.author.role,
      url: siteConfig.url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
    />
  );
}
