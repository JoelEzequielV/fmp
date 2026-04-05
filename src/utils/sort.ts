// src/utils/sort.ts

import type { FileEntry } from "../types/files";

export type SortType =
  | "name_asc"
  | "name_desc"
  | "date_desc"
  | "date_asc"
  | "size_desc"
  | "size_asc";

export function sortFiles(items: FileEntry[], sort: SortType): FileEntry[] {
  const cloned = [...items];

  // Siempre carpetas primero
  cloned.sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    return 0;
  });

  const filesPart = [...cloned].sort((a, b) => {
    switch (sort) {
      case "name_asc":
        return a.name.localeCompare(b.name);

      case "name_desc":
        return b.name.localeCompare(a.name);

      case "date_desc":
        return b.modified - a.modified;

      case "date_asc":
        return a.modified - b.modified;

      case "size_desc":
        return b.size - a.size;

      case "size_asc":
        return a.size - b.size;

      default:
        return a.name.localeCompare(b.name);
    }
  });

  return filesPart.sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    return 0;
  });
}