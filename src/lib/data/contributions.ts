import contributionsData from '@/data/contributions.json';
import { ContributionsSchema } from '@/lib/schemas';

export function getContributions() {
  return ContributionsSchema.parse(contributionsData.contributions);
}
