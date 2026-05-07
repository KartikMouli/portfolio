import educationData from '@/data/education.json';
import { EducationSchema } from '@/lib/schemas';

export function getEducation() {
  return EducationSchema.parse(educationData.educationData);
}
