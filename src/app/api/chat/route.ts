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
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
