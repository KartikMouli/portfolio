import { unstable_cache } from 'next/cache';

import type { Activity } from '@/components/contribution-graph';

type GitHubContributionsResponse = {
  contributions: Activity[];
};

/**
 * 8s ceiling on the upstream call so a slow/hung response doesn't pin
 * the home page's Suspense boundary indefinitely. The API is normally
 * sub-second; if it's slower than this, treat it as failed.
 */
const FETCH_TIMEOUT_MS = 8_000;

/** 1 day. Contributions data only changes once a day at GitHub anyway. */
const CACHE_REVALIDATE_SECONDS = 86_400;

/**
 * The actual cached fetch. Throws on any failure (non-2xx, malformed
 * shape, network/timeout) so `unstable_cache` does NOT populate its
 * entry — Next caches return values, not thrown errors. Net effect: a
 * transient upstream blip retries on the next request instead of
 * locking in a bad result for 24h.
 *
 * The wrapper below catches and returns `[]` so the consumer always
 * gets a renderable value.
 */
const fetchContributions = unstable_cache(
  async (username: string): Promise<Activity[]> => {
    const base =
      process.env.GITHUB_CONTRIBUTIONS_API_URL ||
      'https://github-contributions-api.jogruber.de';

    const res = await fetch(`${base}/v4/${username}?y=last`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!res.ok) {
      throw new Error(
        `[contributions] upstream ${res.status} ${res.statusText}`
      );
    }

    // The upstream returns `{ error: "..." }` on bad usernames / outages
    // with a 200 status, so a status check alone isn't enough — we have
    // to validate the shape too. Without this, `data.contributions`
    // would be `undefined` and crash the consumer's `use(contributions)`.
    const data = (await res.json()) as Partial<GitHubContributionsResponse>;
    if (!Array.isArray(data?.contributions)) {
      throw new Error('[contributions] unexpected response shape');
    }

    return data.contributions;
  },
  ['github-contributions'],
  { revalidate: CACHE_REVALIDATE_SECONDS }
);

/**
 * Public entry point. Resolves to `Activity[]` always — failures
 * degrade gracefully to an empty array (the contribution graph
 * short-circuits on empty input, so the section just renders blank
 * rather than crashing the React tree at `use(contributions)`).
 *
 * The real cause is logged so it surfaces in runtime logs.
 */
export async function getCachedContributions(
  username: string
): Promise<Activity[]> {
  try {
    return await fetchContributions(username);
  } catch (error) {
    console.error('[contributions] fetch failed', error);
    return [];
  }
}
