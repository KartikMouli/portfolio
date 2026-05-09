import { siteConfig } from '@/config/site';

/**
 * Values derived from `siteConfig` that several components share.
 * Centralized here so the parsing logic doesn't drift across files
 * (and so changing the underlying URL in one place propagates everywhere).
 */

/**
 * GitHub username extracted from `siteConfig.links.github` —
 * e.g. "https://github.com/KartikMouli/" → "KartikMouli".
 *
 * Used by the GitHub contribution graph and anywhere we need the bare
 * handle separate from the full profile URL.
 */
export const GITHUB_USERNAME = siteConfig.links.github
  .replace(/\/+$/, '')
  .split('/')
  .pop()!;

/**
 * Site URL with the protocol and any trailing slash stripped —
 * e.g. "https://kartikmouli.me/" → "kartikmouli.me".
 *
 * Used for human-readable display in the hero info grid and OG card.
 */
export const SITE_HOSTNAME = siteConfig.url
  .replace(/^https?:\/\//, '')
  .replace(/\/$/, '');
