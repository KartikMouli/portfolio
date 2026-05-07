import experienceData from '@/data/experience.json';
import { ExperienceSchema } from '@/lib/schemas';
import { sortTimelineDesc } from './sort-timeline';

export function getExperience() {
  return sortTimelineDesc(
    ExperienceSchema.parse(experienceData.experienceData)
  );
}
