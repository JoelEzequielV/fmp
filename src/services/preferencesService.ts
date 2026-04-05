// src/services/preferencesService.ts
import type { SortMode, ViewMode } from "../types/view";

const KEYS = {
  sortMode: "fm_sort_mode",
  viewMode: "fm_view_mode",
};

export const preferencesService = {
  getSortMode(): SortMode {
    const raw = localStorage.getItem(KEYS.sortMode);
    if (raw === "name" || raw === "modified" || raw === "size") return raw;
    return "name";
  },

  setSortMode(value: SortMode) {
    localStorage.setItem(KEYS.sortMode, value);
  },

  getViewMode(): ViewMode {
    const raw = localStorage.getItem(KEYS.viewMode);
    if (raw === "list" || raw === "grid") return raw;
    return "list";
  },

  setViewMode(value: ViewMode) {
    localStorage.setItem(KEYS.viewMode, value);
  },
};