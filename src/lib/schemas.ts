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
});

export const ProjectsSchema = z.array(ProjectSchema);

export const formSchema = z.object({
  name: z.string().min(1, 'Name must be at least 1 characters long.'),
  email: z.string().email('Invalid email address.'),
  message: z.string().min(1, 'Message must be at least 1 characters.'),
});

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
