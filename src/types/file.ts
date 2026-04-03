export type FileKind =
  | 'images'
  | 'documents'
  | 'downloads'
  | 'internal'
  | 'sd'
  | 'favorites';

export type FileType =
  | 'folder'
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'archive'
  | 'apk'
  | 'other';

export interface StorageRoot {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  kind: FileKind;
}

export interface FileEntry {
  id: string;
  name: string;
  uri: string;
  path: string;
  type: FileType;
  isDirectory: boolean;
  size: number;
  modified: number;
  mimeType?: string;
  parentUri?: string | null;
  canRead?: boolean;
  canWrite?: boolean;
}