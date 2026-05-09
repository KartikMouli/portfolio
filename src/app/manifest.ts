import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

// Web app manifest — drives "Add to Home Screen" / installable PWA chrome.
// Icons are auto-discovered by the browser via `icon.svg` + `apple-icon.tsx`,
// but listing them here makes Lighthouse and Android happy.

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.author.name} — ${siteConfig.author.role}`,
    short_name: siteConfig.author.name,
    description: siteConfig.shortDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#ECE6D6', // matches --background (light)
    theme_color: '#1A1714', // matches the favicon ink
    orientation: 'portrait',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
