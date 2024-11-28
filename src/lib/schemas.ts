import { z } from 'zod';

// Define the schema for ProjectLink
export const ProjectLinkSchema = z.object({
  href: z.string().optional(), // Ensure href is a valid URL
  name: z.string().optional(), // Ensure name is a non-empty string
});

// Define the schema for the Project
export const ProjectSchema = z.object({
  name: z.string().min(1), // Ensure name is a non-empty string
  href: z.string().url().optional(), // Ensure href is a valid URL or optional
  description: z.string().min(1), // Ensure description is a non-empty string
  image: z.string().optional(), // Ensure image is a valid URL or optional
  tags: z.array(z.string()).optional(), // Ensure tags is an array of strings (optional)
  links: z.array(ProjectLinkSchema).optional(), // Ensure links is an array of ProjectLink objects (optional)
});

// Define the schema for an array of Project objects
export const ProjectsSchema = z.array(ProjectSchema);


// Define Zod schema for education data
export const EducationItemSchema = z.object({
    image: z.string(), // Validate that image is a valid URL
    university: z.string().min(1), // Ensure university is a non-empty string
    degree: z.string().min(1), // Ensure degree is a non-empty string
    period: z.string().min(1), // Ensure period is a non-empty string
    web: z.string().url(), // Validate that web is a valid URL
});

// Define schema for the entire education data array
export const EducationDataSchema = z.array(EducationItemSchema);

export const formSchema = z.object({
    name: z.string().min(1, "Name must be at least 1 characters long."),
    email: z.string().email("Invalid email address."),
    message: z.string().min(1, "Message must be at least 1 characters."),
});


// Define the schema for TechCard's cardInfo prop
export const TechCardSchema = z.object({
  name: z.string().min(1, "Name is required"), // Ensure name is a non-empty string
  description: z.string().min(1, "Description is required"), // Ensure description is a non-empty string
  imageUrl: z.string(), // Ensure imageUrl is a valid URL
  bgColor: z.string(), // Ensure bgColor is either "white" or "black"
});