import 'server-only';
import { Resend } from 'resend';
import { env } from '@/env';

/**
 * Lazily-initialized Resend client. Module-level singleton so successive
 * calls reuse the same client (and its underlying fetch keep-alive pool).
 *
 * Lazy on purpose: `new Resend(...)` reads the API key at construction
 * time, so deferring it lets `src/env.ts` own all the env validation.
 */
let client: Resend | null = null;

export function getResend(): Resend {
  if (!client) client = new Resend(env.RESEND_API_KEY);
  return client;
}
