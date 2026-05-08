import { siteConfig } from '@/config/site';

/**
 * Structured data emitted in <head>. Three schemas:
 *  1. `Person`      — knowledge graph card (name, role, location, employer,
 *                     alumniOf, contact). Drives Google's right-rail panel
 *                     and rich results for `"kartik mouli"` queries.
 *  2. `WebSite`     — site identity + SearchAction so Google may surface a
 *                     sitelinks search box.
 *  3. `ProfilePage` — declares this page's `mainEntity` is the Person above,
 *                     letting search engines connect the two.
 *
 * Anything sourced from `siteConfig` so updates propagate automatically.
 */
export function JsonLd() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author.name,
    alternateName: siteConfig.author.twitterHandle.replace(/^@/, ''),
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
    </>
  );
}
