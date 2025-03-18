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


// Define Zod schema for education data
export const EducationItemSchema = z.object({
    image: z.string(), 
    university: z.string().min(1), 
    degree: z.string().min(1), 
    period: z.string().min(1), 
    web: z.string().url(), 
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
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"), 
  imageUrl: z.string(), 
  bgColor: z.string(), 
});