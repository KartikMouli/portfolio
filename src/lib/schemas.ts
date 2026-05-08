import { z } from 'zod';

export const ProjectLinkSchema = z.object({
  name: z.string().min(1),
  href: z.string().min(1),
});

export const ProjectSchema = z.object({
  name: z.string().min(1),
  href: z.string().url().optional(),
  description: z.string().min(1),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
  links: z.array(ProjectLinkSchema).optional(),
  /** Slug into `src/content/case-studies/<slug>.mdx`. When set, the
   *  project card shows a "Case study →" link to the rendered page. */
  caseStudy: z.string().optional(),
});

export const ProjectsSchema = z.array(ProjectSchema);

/**
 * Open-source contributions shown on the home page. Hand-curated list
 * of pull requests across third-party repos — see
 * `src/data/contributions.json`. Date stored as ISO yyyy-mm-dd so we
 * can format consistently per locale at render time.
 */
export const ContributionSchema = z.object({
  repo: z.string().min(1),
  prNumber: z.number().int().positive(),
  title: z.string().min(1),
  url: z.string().url(),
  state: z.enum(['open', 'merged', 'closed']),
  date: z.string().min(1),
});

export const ContributionsSchema = z.array(ContributionSchema);

/**
 * Case-study frontmatter schema.
 *
 * Each MDX file in `src/content/case-studies/*.mdx` declares this
 * block at the top. The body of the file is free-form MDX rendered
 * via `next-mdx-remote/rsc` at request time.
 *
 * `slug` is conventionally the filename (sans `.mdx`) — but storing
 * it explicitly lets us validate it doesn't drift, and supports
 * future rename-without-breaking-link cases.
 */
export const CaseStudyFrontmatterSchema = z.object({
  slug: z.string().min(1),
  /** Headline shown on the case-study page + browser tab. */
  title: z.string().min(1),
  /** One-line summary used for OG/meta description + project-card hint. */
  summary: z.string().min(1),
  /** Project this case study belongs to — must match `name` in
   *  `projects.json` so we can backlink to the project entry. */
  projectName: z.string().min(1),
  /** Optional hero image at the top of the case-study page. */
  heroImage: z.string().optional(),
  /** ISO yyyy-mm-dd. Used for metadata + sorting if we ever list
   *  case studies on their own. */
  publishedAt: z.string().min(1),
});

export type CaseStudyFrontmatter = z.infer<typeof CaseStudyFrontmatterSchema>;

/**
 * Contact form schema — shared between the client (RHF + zodResolver) and
 * the Server Action (re-validates server-side; never trust the client).
 *
 * Bounds (`max`) are intentional: protect against 50 KB pastes / payloads
 * meant to blow up the SES recipient. `.trim()` runs on both sides so a
 * message of "  hi  " on either submission path is treated identically.
 *
 * `hp_field` is the honeypot — `max(0)` means any non-empty value is a bot.
 * The action checks this *after* validation passes (silent success so the
 * bot doesn't learn it was caught).
 */
export const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.').max(100),
  email: z.email('Please enter a valid email address.').trim().max(254),
  message: z
    .string()
    .trim()
    .min(10, 'A few more words please — at least 10 characters.')
    .max(5000, 'Please keep messages under 5000 characters.'),
  // Honeypot — must be empty. Optional so missing-field POSTs don't 400;
  // any non-empty value is treated as a bot by the action.
  //
  // Field name is intentionally non-semantic: browsers autofill semantic
  // names like "website" / "url" / "email" even with autocomplete="off"
  // (https://bugs.chromium.org/p/chromium/issues/detail?id=587466), which
  // turns honest humans into false-positive spam.
  hp_field: z.string().max(0, 'Spam detected.').optional(),
});
export type ContactFormValues = z.infer<typeof contactFormSchema>;

// Back-compat alias — keep the old import name working.
export const formSchema = contactFormSchema;

const timelineItemSchema = z.object({
  name: z.string(),
  href: z.string(),
  title: z.string(),
  logo: z.string(),
  start: z.string(),
  end: z.string().optional(),
  description: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
});

export type TimelineItem = z.infer<typeof timelineItemSchema>;
export const ExperienceSchema = z.array(timelineItemSchema);
export const EducationSchema = z.array(timelineItemSchema);

const certificationSchema = z.object({
  name: z.string(),
  issuer: z.string(),
  /** Free-form date string. "MM.YYYY" preferred (matches WorkExperience); "YYYY" also accepted. */
  issuedAt: z.string(),
  href: z.string().url(),
  /** Identifier matched against the icon map in the Certifications component. */
  icon: z.string().optional(),
});

export type Certification = z.infer<typeof certificationSchema>;
export const CertificationsSchema = z.array(certificationSchema);
