import { siteConfig } from '@/config/site';

/**
 * Site-wide structured data emitted in <head> from the root layout. Two
 * schemas, both safe to render on every page:
 *
 *  1. `Person`  — knowledge graph card (name, role, location, employer,
 *                 alumniOf, contact). Drives Google's right-rail panel
 *                 and rich results for `"kartik mouli"` queries.
 *  2. `WebSite` — site identity. Lets Google surface a sitelinks search
 *                 box and connects the brand across pages.
 *
 * `ProfilePage` is **deliberately not here** — it would declare every
 * page's `mainEntity` to be the home-page Person, which is misleading
 * on case-study and blog-post pages where the page's main entity is an
 * Article. ProfilePage lives in `<HomeJsonLd />` and renders only on
 * `/`. Per-page Article / BlogPosting / ItemList schemas are emitted
 * by their own dedicated components.
 *
 * Anything sourced from `siteConfig` so updates propagate automatically.
 */
export function JsonLd() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author.name,
    // `alternateName` is schema.org's "AKA" — perfect fit for a
    // gaming/personal alias. Was previously the cleaned-up Twitter
    // handle, which was a stretch (a handle isn't really an alias).
    alternateName: siteConfig.author.alias,
    jobTitle: siteConfig.author.role,
    description: siteConfig.author.tagline,
    url: siteConfig.url,
    image: `${siteConfig.url}/img/pfp-avatar.jpg`,
    email: `mailto:${siteConfig.author.email}`,
    telephone: siteConfig.author.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nashik',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    worksFor: {
      '@type': 'Organization',
      name: siteConfig.currentRole.company,
      url: siteConfig.currentRole.companyUrl,
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Indian Institute of Technology, Patna',
      url: 'https://www.iitp.ac.in/',
    },
    sameAs: [
      siteConfig.links.github,
      siteConfig.links.linkedin,
      siteConfig.links.twitter,
      siteConfig.links.leetcode,
    ],
    knowsAbout: [...siteConfig.knowsAbout],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${siteConfig.author.name}'s Portfolio`,
    url: siteConfig.url,
    description: siteConfig.shortDescription,
    inLanguage: siteConfig.locale.replace('_', '-'),
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
