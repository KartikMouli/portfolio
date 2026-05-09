import { create } from 'zustand';

/**
 * Selected tag for the `/blog` tag filter.
 *
 * Mirrors `useProjectsFilter`: `null` = "All" (no filter active),
 * string = the tag from a post's frontmatter `tags` array. Single-
 * select by design — picking a different chip replaces the previous.
 *
 * In-memory only (no localStorage). Same reasoning as the projects
 * filter: returning visitors generally want the default "All" view,
 * not whatever filter they had active last time.
 */
interface BlogFilterStore {
  selectedTag: string | null;
  /** Pass `null` to clear the filter (equivalent to clicking "All"). */
  setSelectedTag: (tag: string | null) => void;
}

export const useBlogFilter = create<BlogFilterStore>((set) => ({
  selectedTag: null,
  setSelectedTag: (tag) => set({ selectedTag: tag }),
}));
