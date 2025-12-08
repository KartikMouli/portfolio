export function JsonLd() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Kartik Mouli',
    jobTitle: 'Software Developer',
    url: 'https://kartikmouli.in',
    sameAs: [
      'https://github.com/KartikMouli',
      'https://linkedin.com/in/kartik-mouli',
      'https://x.com/kartikmouli',
    ],
    knowsAbout: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Node.js',
      'Web Development',
      'Full Stack Development',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: "Kartik Mouli's Portfolio",
    url: 'https://kartikmouli.in',
    description:
      'Personal portfolio of Kartik Mouli, a Software Developer showcasing projects, skills, and experience.',
  };

  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: 'Kartik Mouli',
      jobTitle: 'Software Developer',
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
