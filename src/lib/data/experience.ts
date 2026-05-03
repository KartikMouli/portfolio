import experienceData from '@/data/experience.json';
import { ExperienceSchema } from '@/lib/schemas';

export function getExperience() {
  return ExperienceSchema.parse(experienceData.experienceData);
}
