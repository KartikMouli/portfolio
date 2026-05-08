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

  // Contact form anti-spam — comma-separated host allow-list, parsed into a
  // Set<string> so the Server Action does an O(1) `.has()` lookup against
  // the request's `Host` header. Default covers local dev + apex + www.
  CONTACT_ALLOWED_HOSTS: z
    .string()
    .default('localhost:3000')
    .transform(
      (s) =>
        new Set(
          s
            .split(',')
            .map((x) => x.trim())
            .filter(Boolean)
        )
    ),

  // SEO — Google Search Console verification token.
  GOOGLE_VERIFICATION_CODE: z.string().optional(),
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
