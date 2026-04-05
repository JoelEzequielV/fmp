export type FileType =
  | "folder"
  | "image"
  | "video"
  | "audio"
  | "archive"
  | "apk"
  | "file";

export type FilterType =
  | "all"
  | "folders"
  | "images"
  | "videos"
  | "audio"
  | "documents"
  | "apk"
  | "archives";

export type SortMode =
  | "name-asc"
  | "name-desc"
  | "date-desc"
  | "date-asc"
  | "size-desc"
  | "size-asc";

export type ViewMode = "list" | "grid";
export type FileVisualType = ViewMode;

export interface FileEntry {
  id?: string;
  uri: string;
  name: string;
  isDirectory: boolean;
  mimeType: string;
  size: number;
  modified: number;
  type: FileType;
  favorite?: boolean;
}

export interface ListDirectoryResult {
  currentUri: string;
  items: FileEntry[];
}

export interface SavedRoot {
  id: string;
  name: string;
  uri: string;
  createdAt: number;
}

export interface RecentItem extends FileEntry {
  openedAt: number;
}

export type RecentEntry = RecentItem;

export interface StorageRoot {
  id: string;
  title: string;
  subtitle: string;
  uri?: string;
  icon?: string;
}

export interface MediaPreviewItem {
  uri: string;
  name: string;
  mimeType: string;
  type: FileType;
}