import type { ExperienceItemType } from '@/components/work-experience';
import experienceJson from '@/data/experience.json';
import educationJson from '@/data/education.json';
import { ExperienceSchema, EducationSchema } from '@/lib/schemas';
import { sortTimelineDesc } from './sort-timeline';
import { CodeXml, GraduationCap, BookOpen } from 'lucide-react';

/**
 * Adapters converting our timeline JSON (`experience.json`, `education.json`)
 * into the shape expected by `<WorkExperience />` from `@ncdai/work-experience`.
 *
 * Transforms:
 *   1. Date format `"Sept 2025"` → `"09.2025"` (component parses with date-fns).
 *   2. `description: string[]` (our bullet array) → markdown bullet string.
 *   3. Multiple positions at the same company are grouped into one item.
 *   4. Per-position icon: `<CodeXml />` for engineering roles,
 *      `<GraduationCap />` for higher education, `<BookOpen />` for school.
 */

const MONTH_MAP: Record<string, string> = {
  jan: '01',
  january: '01',
  feb: '02',
  february: '02',
  mar: '03',
  march: '03',
  apr: '04',
  april: '04',
  may: '05',
  jun: '06',
  june: '06',
  jul: '07',
  july: '07',
  aug: '08',
  august: '08',
  sep: '09',
  sept: '09',
  september: '09',
  oct: '10',
  october: '10',
  nov: '11',
  november: '11',
  dec: '12',
  december: '12',
};

function toMonthYear(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed || /^present$/i.test(trimmed)) return undefined;
  const parts = trimmed.split(/\s+/);
  if (parts.length === 2) {
    const [monthRaw, yearRaw] = parts;
    const month = MONTH_MAP[monthRaw.toLowerCase().replace(/\.$/, '')];
    const year = yearRaw.match(/^\d{4}$/) ? yearRaw : undefined;
    if (month && year) return `${month}.${year}`;
  }
  // Fallback: pass through (component supports yearly "YYYY" too).
  return trimmed;
}

function bulletsToMarkdown(bullets?: string[]): string | undefined {
  if (!bullets || bullets.length === 0) return undefined;
  if (bullets.length === 1) return bullets[0];
  return bullets.map((b) => `- ${b}`).join('\n');
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Work experience: groups positions by company name. Within a company,
 * positions stay in date-descending order; companies are sorted by their
 * most recent position's start date.
 */
export function getWorkExperienceForComponent(): ExperienceItemType[] {
  const items = sortTimelineDesc(
    ExperienceSchema.parse(experienceJson.experienceData)
  );

  const order: string[] = [];
  const groups = new Map<string, typeof items>();
  for (const item of items) {
    if (!groups.has(item.name)) {
      groups.set(item.name, []);
      order.push(item.name);
    }
    groups.get(item.name)!.push(item);
  }

  return order.map((companyName) => {
    const positions = groups.get(companyName)!;
    const head = positions[0];
    const isCurrentEmployer = positions.some(
      (p) => !p.end || /^present$/i.test(p.end)
    );
    const slug = slugify(companyName);

    return {
      id: slug,
      companyName,
      companyLogo: head.logo,
      companyWebsite: head.href,
      isCurrentEmployer,
      positions: positions.map((p, idx) => ({
        id: `${slug}-${idx}`,
        title: p.title,
        icon: <CodeXml />,
        employmentPeriod: {
          start: toMonthYear(p.start) ?? p.start,
          end: p.end ? toMonthYear(p.end) : undefined,
        },
        description: bulletsToMarkdown(p.description),
        skills: p.skills,
        // Auto-expand the most recent position so the latest detail
        // is visible without a click.
        isExpanded: idx === 0,
      })),
    };
  });
}

/**
 * Education: each school is its own "company" with one "position" (the degree).
 * Sorted descending by start date.
 */
export function getEducationForComponent(): ExperienceItemType[] {
  const items = sortTimelineDesc(
    EducationSchema.parse(educationJson.educationData)
  );

  return items.map((item, idx) => {
    const slug = slugify(`${item.name}-${idx}`);
    // GraduationCap for university-level degrees (BTech / MTech / Bachelor / etc.),
    // BookOpen for school-level entries (HSC / SSC).
    const isHigherEd = !/\b(SSC|HSC|Exam)\b/i.test(item.title);
    const icon = isHigherEd ? <GraduationCap /> : <BookOpen />;
    return {
      id: slug,
      companyName: item.name,
      companyLogo: item.logo,
      companyWebsite: item.href,
      isCurrentEmployer: !item.end || /^present$/i.test(item.end),
      positions: [
        {
          id: `${slug}-pos`,
          title: item.title,
          icon,
          employmentPeriod: {
            start: toMonthYear(item.start) ?? item.start,
            end: item.end ? toMonthYear(item.end) : undefined,
          },
          description: bulletsToMarkdown(item.description),
          skills: item.skills,
          isExpanded: idx === 0,
        },
      ],
    };
  });
}
