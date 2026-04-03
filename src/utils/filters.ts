import { FileEntry, FileKind } from '../types/file';

export type SortMode = 'name_asc' | 'name_desc' | 'date_desc' | 'date_asc' | 'size_desc' | 'size_asc';

export function filterByKind(items: FileEntry[], kind: FileKind): FileEntry[] {
  switch (kind) {
    case 'images':
      return items.filter((i) => i.type === 'image');
    case 'documents':
      return items.filter((i) => i.type === 'document');
    case 'downloads':
      return items.filter((i) => i.name.toLowerCase().includes('download') || i.parentUri?.toLowerCase().includes('download'));
    default:
      return items;
  }
}

export function filterBySearch(items: FileEntry[], query: string): FileEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((i) => i.name.toLowerCase().includes(q));
}

export function sortItems(items: FileEntry[], mode: SortMode): FileEntry[] {
  const arr = [...items];

  arr.sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;

    switch (mode) {
      case 'name_desc':
        return b.name.localeCompare(a.name);
      case 'date_desc':
        return (b.modified || 0) - (a.modified || 0);
      case 'date_asc':
        return (a.modified || 0) - (b.modified || 0);
      case 'size_desc':
        return (b.size || 0) - (a.size || 0);
      case 'size_asc':
        return (a.size || 0) - (b.size || 0);
      case 'name_asc':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return arr;
}