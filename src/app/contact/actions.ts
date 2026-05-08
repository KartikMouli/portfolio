'use server';

import { after } from 'next/server';
import { headers } from 'next/headers';
import { env } from '@/env';
import { getResend } from '@/lib/resend';
import { contactFormSchema } from '@/lib/schemas';
import { siteConfig } from '@/config/site';
import {
  renderContactEmailHtml,
  renderContactEmailText,
} from './email-template';

/**
 * Discriminated state returned to the client. The form maps each variant
 * to a specific UX:
 *   - `idle` / `success`  →  no inline alert (success swaps to <ContactSuccess />)
 *   - `invalid`            →  per-field highlights via RHF setError + toast
 *   - `error`              →  toast only (rare — bad origin / unknown failure)
 *   - `service_unavailable` →  inline alert with mailto fallback (preserves
 *                              the user's typed message)
 */
export type ContactActionState =
  | { status: 'idle' }
  | { status: 'success' }
  | {
      status: 'invalid';
      fieldErrors: Partial<Record<'name' | 'email' | 'message', string>>;
    }
  | { status: 'error'; message: string }
  | { status: 'service_unavailable'; message: string };

const FROM = 'Kartik Mouli <hello@kartikmouli.me>';

const SERVICE_UNAVAILABLE_MESSAGE =
  'Mail service is temporarily unavailable. Use the direct email link below.';

export async function sendContactEmail(
  _prev: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  const h = await headers();
  const host = h.get('host') ?? '';

  // 1. Origin check — reject anything outside the env-driven allow-list.
  // Cheap CSRF-ish defense; Server Actions also have framework-level origin
  // checks, this is belt-and-suspenders against misconfigured proxies.
  if (!env.CONTACT_ALLOWED_HOSTS.has(host)) {
    return { status: 'error', message: 'Invalid request origin.' };
  }

  // 2. Re-validate server-side. Never trust the client.
  const parsed = contactFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0]?.toString();
      if (k && !fieldErrors[k]) fieldErrors[k] = issue.message;
    }
    return { status: 'invalid', fieldErrors };
  }

  // 3. Honeypot — silent success so bots don't learn they were caught.
  // Logged via after() for visibility on attempted spam.
  if (parsed.data.hp_field && parsed.data.hp_field.length > 0) {
    after(() =>
      console.log('[contact] honeypot triggered', {
        ip: h.get('x-forwarded-for'),
      })
    );
    return { status: 'success' };
  }

  const { name, email, message } = parsed.data;

  // 4. Send.
  try {
    const subjectPreview =
      message.length > 60 ? `${message.slice(0, 60)}…` : message;
    const { error } = await getResend().emails.send({
      from: FROM,
      to: siteConfig.author.email,
      replyTo: email,
      subject: `Portfolio: ${name} — ${subjectPreview}`,
      html: renderContactEmailHtml({ name, email, message }),
      text: renderContactEmailText({ name, email, message }),
      headers: { 'X-Entity-Ref-ID': crypto.randomUUID() },
    });

    if (error) {
      after(() => console.error('[contact] resend error', error));
      return {
        status: 'service_unavailable',
        message: SERVICE_UNAVAILABLE_MESSAGE,
      };
    }
  } catch (err) {
    after(() => console.error('[contact] send threw', err));
    return {
      status: 'service_unavailable',
      message: SERVICE_UNAVAILABLE_MESSAGE,
    };
  }

  // 5. Fire-and-forget telemetry (Vercel runtime logs picks it up).
  after(() =>
    console.log('[contact] sent', {
      at: new Date().toISOString(),
      ip: h.get('x-forwarded-for'),
      ua: h.get('user-agent'),
    })
  );

  return { status: 'success' };
}
