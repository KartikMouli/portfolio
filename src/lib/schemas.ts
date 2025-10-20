import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { z } from 'zod';

// Define the schema for ProjectLink
export const ProjectLinkSchema = z.object({
  href: z.string().optional(),
  name: z.string().optional(),
});

// Define the schema for the Project
export const ProjectSchema = z.object({
  name: z.string().min(1),
  href: z.string().url().optional(),
  description: z.string().min(1),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
  links: z.array(ProjectLinkSchema).optional(),
});

// Define the schema for an array of Project objects
export const ProjectsSchema = z.array(ProjectSchema);

export const formSchema = z.object({
  name: z.string().min(1, 'Name must be at least 1 characters long.'),
  email: z.string().email('Invalid email address.'),
  message: z.string().min(1, 'Message must be at least 1 characters.'),
});

// Define the schema for TechCard's cardInfo prop
export const TechCardSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string(),
  bgColor: z.string(),
});

const iconLink = z.object({
  name: z.string(),
  href: z.string().url(),
  icon: z.custom<keyof typeof dynamicIconImports>(),
});
export type IconLink = z.infer<typeof iconLink>;

const timelineItem = z.object({
  name: z.string(),
  href: z.string(),
  title: z.string(),
  logo: z.string(),
  start: z.string(),
  end: z.string().optional(),
  description: z.array(z.string()).optional(),
  links: z.array(iconLink).optional(),
});

export type TimelineItemSchema = z.infer<typeof timelineItem>;
export const ExperienceSchema = z.array(timelineItem);
export const EducationSchema = z.array(timelineItem);
