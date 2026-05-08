import 'server-only';

/**
 * Same-origin request guard, shared across the contact Server Action and
 * the `/api/chat` Route Handler so both endpoints enforce the same policy.
 *
 * The check mirrors what Next.js does internally for Server Actions CSRF
 * defense: compare the request's `Origin` header against `x-forwarded-host`
 * (the public-facing host when behind a reverse proxy like Vercel),
 * falling back to `host` for non-proxied dev. Modern browsers always send
 * `Origin` on POST, so a missing or mismatched value strongly indicates
 * either a cross-site call or a non-browser client that didn't bother
 * forging headers.
 *
 * What this stops:
 *   - Browser-based CSRF and embedding from any other origin
 *   - Random scrapers / curl invocations that don't forge `Origin`
 *
 * What this does NOT stop (intentional, callers should know):
 *   - A motivated attacker forging `Origin: https://kartikmouli.me`. For
 *     that you'd need rate limiting + auth, both deliberately skipped
 *     for this portfolio's scope.
 *
 * Why no env-var allow-list: same-origin is automatically correct on
 * every deploy URL — apex, www, Vercel previews, custom domains — since
 * the browser's own URL is what populates `Origin`. An ALLOWED_HOSTS list
 * needs maintenance per new domain and silently 403s when out of date.
 *
 * Accepts a structural `HeadersLike` so it works with both:
 *   - `Request['headers']` (a `Headers` instance) from Route Handlers
 *   - The `ReadonlyHeaders` returned by `await headers()` in Server
 *     Actions / Server Components
 */

type HeadersLike = { get(name: string): string | null };

export function isSameOriginRequest(headers: HeadersLike): boolean {
  const origin = headers.get('origin');
  const host = headers.get('x-forwarded-host') ?? headers.get('host');
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
