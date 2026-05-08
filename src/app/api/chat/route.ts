import { google } from '@ai-sdk/google';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';

import '@/env'; // module-load env validation; missing API key fails fast

/**
 * `/api/chat` — streaming Gemini endpoint backing the assistant-ui modal.
 *
 * This is the canonical AI SDK + assistant-ui pairing from the official
 * guide: receive `messages` as `UIMessage[]`, run them through
 * `convertToModelMessages` (async in v6 — handles attachment URL→data
 * conversion), stream from Gemini, return as a UI-message stream the
 * client's `useChatRuntime` knows how to consume.
 *
 * Reads `GOOGLE_GENERATIVE_AI_API_KEY` from env transparently via the
 * `@ai-sdk/google` provider. The import of `@/env` above ensures it's
 * validated at module load, so a missing key crashes this route file
 * instead of producing a confusing 500 on first chat.
 *
 * `streamText` is naturally dynamic — Next 16 cacheComponents accepts
 * the route as-is without `runtime` / `dynamic` segment exports, which
 * it would actually reject if we added them.
 */
export async function POST(req: Request) {
  // Same-origin check — the canonical CSRF / cross-site-abuse defense for
  // public Route Handlers, mirroring what Next.js does internally for
  // Server Actions. Compare `Origin` against `x-forwarded-host` (the
  // public-facing host when behind a reverse proxy like Vercel), falling
  // back to `host` for non-proxied dev. Modern browsers always send
  // `Origin` on POST, so a missing or mismatched header is a strong
  // signal of either a cross-site call or a header-stripping client.
  //
  // Caveat (intentional, not a bug): this does NOT stop a motivated
  // attacker who forges `Origin: https://kartikmouli.me` themselves
  // — header forgery is trivial. For that you'd need rate limiting +
  // auth, which we deliberately skip for this portfolio chatbot. What
  // this DOES stop is the bulk of casual abuse: random scrapers that
  // don't bother forging headers, and any browser-based CSRF from
  // other sites.
  //
  // Why no env-var allow-list: same-origin is automatically correct on
  // every deploy URL (apex, www, Vercel previews, custom domains) since
  // the browser's own URL is the one in `Origin`. An allow-list would
  // need updating on every new deploy host.
  const origin = req.headers.get('origin');
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
  if (!origin || !host) {
    return new Response('Forbidden', { status: 403 });
  }
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return new Response('Forbidden', { status: 403 });
  }
  if (originHost !== host) {
    return new Response('Forbidden', { status: 403 });
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
