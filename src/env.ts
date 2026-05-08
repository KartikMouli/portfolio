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
  // Resend — for the contact-form Server Action.
  // Optional so `pnpm build` works in CI without secrets; the contact
  // form will fail at send-time (`getResend().emails.send()` throws)
  // if the key is missing in a deployed environment that needs it.
  RESEND_API_KEY: z.string().optional(),

  // SEO — Google Search Console verification token.
  GOOGLE_VERIFICATION_CODE: z.string().optional(),

  // Gemini API key for the portfolio chatbot. The variable name is the
  // exact one `@ai-sdk/google` reads transparently from `process.env`
  // — don't rename, the SDK won't pick it up under a different name.
  // Optional so `pnpm build` works in CI without secrets; the
  // `/api/chat` route will 500 if the key is missing in production.
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // `z.flattenError` is the zod 4 replacement for the deprecated
  // `error.flatten()` instance method; same shape (`{ formErrors,
  // fieldErrors }`), supported API.
  console.error(
    'Invalid environment variables:',
    z.flattenError(parsed.error).fieldErrors
  );
  throw new Error('Invalid environment variables — see logs above.');
}

export const env = parsed.data;
