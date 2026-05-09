'use client';

import { useBlogFilter } from '@/lib/store/blog-filter';
import { cn } from '@/lib/utils';

interface TagWithCount {
  tag: string;
  count: number;
}

interface BlogTagChipsProps {
  /** All distinct tags (from `getAllTags()` on the server) with their
   *  counts. Already sorted by frequency desc, then alphabetical. */
  tags: TagWithCount[];
  /** Total number of published posts — drives the "All" chip count. */
  totalPosts: number;
}

/**
 * Filter chips for `/blog`. Visually mirrors `<ProjectsFilterChips>`:
 * single-select pill row, count badge, "All" first, clicking the
 * active chip clears the filter.
 *
 * Tag list is computed **on the server** (`getAllTags`) and passed as
 * a prop — `getAllPostMetas` is `'server-only'`, so we can't recompute
 * client-side. Hidden when there are no tags (e.g. fresh blog with one
 * untagged post) so the page doesn't look empty-but-not-empty.
 */
export function BlogTagChips({ tags, totalPosts }: BlogTagChipsProps) {
  const selected = useBlogFilter((s) => s.selectedTag);
  const setSelected = useBlogFilter((s) => s.setSelectedTag);

  if (tags.length === 0) return null;

  return (
    <div
      role="group"
      aria-label="Filter writing by tag"
      className="flex flex-wrap gap-2"
    >
      <Chip
        label="All"
        count={totalPosts}
        active={selected === null}
        onClick={() => setSelected(null)}
      />
      {tags.map(({ tag, count }) => (
        <Chip
          key={tag}
          label={tag}
          count={count}
          active={selected === tag}
          onClick={() => setSelected(selected === tag ? null : tag)}
        />
      ))}
    </div>
  );
}

interface ChipProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

function Chip({ label, count, active, onClick }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-background hover:bg-muted'
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          'tabular-nums',
          active ? 'text-primary-foreground/70' : 'text-muted-foreground'
        )}
      >
        {count}
      </span>
    </button>
  );
}
