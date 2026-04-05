// src/types/clipboard.ts
import type { FileEntry } from "./files";

export type ClipboardMode = "copy" | "cut";

export interface ClipboardState {
  items: FileEntry[];
  mode: ClipboardMode;
  createdAt: number;
}