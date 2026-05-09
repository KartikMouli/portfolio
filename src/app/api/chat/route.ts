import { google } from '@ai-sdk/google';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';

import { env } from '@/env';
import { isSameOriginRequest } from '@/lib/same-origin';

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
 * `@ai-sdk/google` provider. The key is `.optional()` in the env schema
 * so `pnpm build` works without secrets in CI; the pre-flight check
 * inside `POST` returns a sanitized 503 if it's missing at request
 * time, instead of letting the provider's raw "API key is missing…"
 * message reach the UI bubble.
 *
 * `streamText` is naturally dynamic — Next 16 cacheComponents accepts
 * the route as-is without `runtime` / `dynamic` segment exports, which
 * it would actually reject if we added them.
 */
export async function POST(req: Request) {
  // Same-origin guard — see `src/lib/same-origin.ts` for the rationale
  // and threat-model notes. Mirrors the contact Server Action so both
  // endpoints enforce the identical policy.
  if (!isSameOriginRequest(req.headers)) {
    return new Response('Forbidden', { status: 403 });
  }

  // Pre-flight: `@ai-sdk/google` validates the API key lazily, *during*
  // stream consumption. By that point we're already inside the
  // UI-message stream, and the raw provider error ("Google Generative
  // AI API key is missing. Pass it using the 'apiKey' parameter or the
  // GOOGLE_GENERATIVE_AI_API_KEY…") would surface verbatim in the
  // assistant-ui error bubble. Bail early with a generic 503 instead.
  if (!env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error('[chat] GOOGLE_GENERATIVE_AI_API_KEY not configured');
    return new Response(
      JSON.stringify({ error: 'Chat is currently unavailable.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  // `streamText` and `convertToModelMessages` can throw on network
  // failures, quota errors, or malformed messages. Without this guard
  // the route returns an opaque 500; logging + a structured response
  // gives the client something to render and surfaces the cause in
  // Vercel runtime logs.
  try {
    const result = streamText({
      model: google('gemini-2.5-flash'),
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse({
      // Belt-and-braces over the pre-flight above: anything thrown
      // *inside* the stream (rate-limits, upstream 5xx, malformed
      // responses) still flows through this callback. The string we
      // return is what assistant-ui renders in `<ErrorPrimitive.Message
      // />`, so it must be user-safe — never the raw provider message,
      // which can leak env-var names or partial keys. Real cause goes
      // to the server log.
      onError: (error) => {
        console.error('[chat] stream error', error);
        return 'Something went wrong. Please try again.';
      },
    });
  } catch (error) {
    console.error('[chat] streamText failed', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
