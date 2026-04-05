import type { FileEntry, FilterType, SortMode } from "../types/files";

export const filterFiles = (
  files: FileEntry[],
  search: string,
  filterBy: FilterType = "all"
): FileEntry[] => {
  const query = search.trim().toLowerCase();

  return files.filter((file) => {
    const matchesSearch = !query || file.name.toLowerCase().includes(query);

    let matchesFilter = true;

    switch (filterBy) {
      case "folders":
        matchesFilter = file.isDirectory;
        break;
      case "images":
        matchesFilter = file.type === "image";
        break;
      case "videos":
        matchesFilter = file.type === "video";
        break;
      case "audio":
        matchesFilter = file.type === "audio";
        break;
      case "documents":
        matchesFilter =
          !file.isDirectory &&
          ["application/pdf", "text/plain", "application/msword"].some((m) =>
            file.mimeType?.includes(m)
          );
        break;
      case "apk":
        matchesFilter = file.type === "apk";
        break;
      case "archives":
        matchesFilter = file.type === "archive";
        break;
      default:
        matchesFilter = true;
    }

    return matchesSearch && matchesFilter;
  });
};

export const sortFiles = (
  files: FileEntry[],
  sortBy: SortMode = "name-asc"
): FileEntry[] => {
  const sorted = [...files];

  sorted.sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;

    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "date-desc":
        return (b.modified || 0) - (a.modified || 0);
      case "date-asc":
        return (a.modified || 0) - (b.modified || 0);
      case "size-desc":
        return (b.size || 0) - (a.size || 0);
      case "size-asc":
        return (a.size || 0) - (b.size || 0);
      default:
        return 0;
    }
  });

  return sorted;
};