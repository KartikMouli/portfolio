import educationData from '@/data/education.json';
import { EducationSchema } from '@/lib/schemas';
import { sortTimelineDesc } from './sort-timeline';

export function getEducation() {
  return sortTimelineDesc(EducationSchema.parse(educationData.educationData));
}
