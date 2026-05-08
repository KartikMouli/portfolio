import 'server-only';
import { z } from 'zod';

/**
 * Typed, validated server-only environment variables.
 *
 * Single source of truth for everything we read off `process.env`. Imports
 * marked `server-only`, so any accidental import from a client component is a
 * build-time error — keys can't leak to the bundle.
 *
 * Validation runs once at module load. Invalid env crashes the dev server
 * and the production build with a structured error — this is intentional
 * (silent fallbacks hide config drift).
 */
const envSchema = z.object({
  // Resend — required. Get one at https://resend.com/api-keys (send-only scope).
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),

  // SEO — Google Search Console verification token.
  GOOGLE_VERIFICATION_CODE: z.string().optional(),

  // Gemini API key for the portfolio chatbot. The variable name is the
  // exact one `@ai-sdk/google` reads transparently — don't rename, the
  // SDK won't pick it up under a different name. Required so a missing
  // key crashes module load instead of failing silently at first chat.
  GOOGLE_GENERATIVE_AI_API_KEY: z
    .string()
    .min(1, 'GOOGLE_GENERATIVE_AI_API_KEY is required'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    'Invalid environment variables:',
    parsed.error.flatten().fieldErrors
  );
  throw new Error('Invalid environment variables — see logs above.');
}

export const env = parsed.data;
