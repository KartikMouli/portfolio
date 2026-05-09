import 'server-only';

/**
 * Plain-template email renderers for the contact-form Server Action.
 *
 * No `react-email` dep — for one 40-line template, a tagged literal is more
 * maintainable. Inline styles only because Gmail strips `<style>` blocks.
 *
 * Both HTML and plain-text variants are sent so:
 *   - Apple Mail / Outlook with images-off shows the text fallback
 *   - Spam scoring engines reward presence of plain-text alternative
 *   - Screen readers can fall back to text if HTML rendering fails
 */

export type ContactEmailFields = {
  name: string;
  email: string;
  message: string;
};

/** Minimal HTML escape — input is user-controlled. */
function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/**
 * Branded HTML email. Theme uses the site's stone/copper palette so it
 * feels of-a-piece with the portfolio. Pre-wrapped message preserves the
 * sender's line breaks without trusting their HTML.
 */
export function renderContactEmailHtml({
  name,
  email,
  message,
}: ContactEmailFields): string {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replaceAll('\n', '<br />');

  return `<!doctype html>
<html lang="en">
<body style="margin:0;padding:24px;background:#1a1714;color:#e5e1d6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#232026;border:1px solid #3a3530;border-radius:8px;">
    <tr>
      <td style="padding:24px;">
        <p style="margin:0 0 6px;font-size:11px;color:#a99a85;text-transform:uppercase;letter-spacing:.08em;font-weight:600;">
          New message via kartikmouli.me
        </p>
        <h1 style="margin:0 0 20px;font-size:18px;font-weight:600;color:#f5efde;">
          ${safeName}
        </h1>

        <p style="margin:0 0 4px;font-size:12px;color:#a99a85;">From</p>
        <p style="margin:0 0 20px;font-size:14px;">
          <a href="mailto:${safeEmail}" style="color:#d8a37a;text-decoration:none;">
            ${safeEmail}
          </a>
        </p>

        <p style="margin:0 0 6px;font-size:12px;color:#a99a85;">Message</p>
        <div style="font-size:14px;line-height:1.65;color:#e5e1d6;white-space:pre-wrap;">
          ${safeMessage}
        </div>

        <hr style="margin:24px 0;border:0;border-top:1px solid #3a3530;" />
        <p style="margin:0;font-size:12px;color:#7a715f;">
          Hit Reply — it goes straight to ${safeName}.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Plain-text fallback for non-HTML mail clients. */
export function renderContactEmailText({
  name,
  email,
  message,
}: ContactEmailFields): string {
  return `New message via kartikmouli.me
─────────────────────────────

From:    ${name} <${email}>

${message}

─────────────────────────────
Hit Reply — it goes straight to ${name}.
`;
}
