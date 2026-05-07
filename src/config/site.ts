/**
 * Single source of truth for portfolio metadata, links, and identity.
 *
 * Anything that's "about you the person" or "about this site" lives here.
 * Content (projects, experience, education) lives in `src/data/*.json`.
 *
 * Touching a value here propagates to: <head> metadata, OpenGraph, Twitter
 * cards, JSON-LD, sitemap, robots, footer, contact mailto, social links,
 * and the home/about pages.
 */
export const siteConfig = {
  // ---- site identity ----
  name: 'Kartik Mouli',
  shortName: 'kartik-portfolio',
  title: 'Kartik Mouli | Software Developer Portfolio',
  titleTemplate: '%s | Kartik Mouli',
  description:
    'Software Developer portfolio of Kartik Mouli. Explore projects built with React, Next.js, TypeScript, and modern web technologies. Available for freelance and full-time opportunities.',
  shortDescription:
    'Software Developer portfolio showcasing projects built with React, Next.js, TypeScript, and modern web technologies.',
  url: 'https://kartikmouli.in',
  // Note: OG / Twitter share images are generated dynamically at
  // `src/app/opengraph-image.tsx` and `src/app/twitter-image.tsx`.
  // The favicon is `src/app/icon.svg` + `src/app/apple-icon.tsx`.
  locale: 'en_US',
  language: 'en',

  // ---- author ----
  author: {
    name: 'Kartik Mouli',
    role: 'SDE',
    email: 'kartikmouli156@gmail.com',
    location: 'Nashik, Maharashtra 🇮🇳',
    education: "IITP CSE'24",
    twitterHandle: '@KartikMouli',
  },

  // ---- current role (rendered on home) ----
  currentRole: {
    title: 'SDE',
    company: 'Unizoy',
    companyUrl: 'https://unizoy.com',
  },

  // ---- external links (professional only) ----
  links: {
    resume:
      'https://drive.google.com/file/d/16ebey3K6tIWcpgVi0Gc7zI3mYVpgdHxR/view?usp=drive_link',
    github: 'https://github.com/KartikMouli',
    linkedin: 'https://linkedin.com/in/kartik-mouli',
    twitter: 'https://x.com/kartikmouli',
    leetcode: 'https://leetcode.com/u/monchi02/',
  },

  // ---- SEO keywords ----
  keywords: [
    'Kartik Mouli',
    'Software Developer',
    'React Developer',
    'Next.js Developer',
    'TypeScript',
    'JavaScript',
    'Web Developer',
    'Frontend Developer',
    'Backend Developer',
    'Portfolio',
    'Software Engineer',
  ],

  // ---- knowsAbout for JSON-LD Person schema ----
  knowsAbout: [
    'React',
    'Next.js',
    'TypeScript',
    'JavaScript',
    'Node.js',
    'Web Development',
    'Full Stack Development',
  ],
} as const;

export type SiteConfig = typeof siteConfig;
