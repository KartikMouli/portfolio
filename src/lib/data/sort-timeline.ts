/**
 * Sorts timeline entries (experience / education) so the most recent appears
 * first. Anything with `end` missing or set to "Present" is treated as
 * currently active and sorted ahead of dated entries; dated entries are then
 * sorted by `start` descending.
 *
 * Date strings like "Apr 2025" / "Sept 2025" are parsed via `Date.parse`,
 * which handles the common "MMM YYYY" shape used in the data files.
 */
type TimelineLike = { start?: string; end?: string };

const isCurrent = (end?: string) =>
  !end || end.trim().toLowerCase() === 'present';

const startTime = (s?: string) => {
  if (!s) return 0;
  const t = Date.parse(s);
  return Number.isNaN(t) ? 0 : t;
};

export function sortTimelineDesc<T extends TimelineLike>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const aCurrent = isCurrent(a.end);
    const bCurrent = isCurrent(b.end);
    if (aCurrent !== bCurrent) return aCurrent ? -1 : 1;
    return startTime(b.start) - startTime(a.start);
  });
}
