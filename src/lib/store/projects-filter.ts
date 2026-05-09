import { create } from 'zustand';

/**
 * Selected tag for the projects-page filter.
 *
 * `null` = "All" (no filter active). String = the canonical tag from
 * `src/data/projects.json` (e.g. "React", "TypeScript"). Single-select
 * by design — picking a different chip replaces the previous selection.
 *
 * Persisted in-memory only. We deliberately don't add the localStorage
 * middleware because:
 *   - The filter is a transient browse-mode aid, not a user setting.
 *   - Returning visitors generally want the default "All" view, not
 *     whatever filter they had active last time (which they may have
 *     forgotten about).
 */
interface ProjectsFilterStore {
  selectedTag: string | null;
  /** Pass `null` to clear the filter (equivalent to clicking "All"). */
  setSelectedTag: (tag: string | null) => void;
}

export const useProjectsFilter = create<ProjectsFilterStore>((set) => ({
  selectedTag: null,
  setSelectedTag: (tag) => set({ selectedTag: tag }),
}));
