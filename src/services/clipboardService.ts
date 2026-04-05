// src/services/clipboardService.ts
import type {
  ClipboardMode,
  ClipboardState,
} from "../types/clipboard";
import type { FileEntry } from "../types/files";
import { storageService } from "./storageService";

function uniqueByUri<T extends { uri: string }>(items: T[]): T[] {
  return items.filter(
    (item, index, arr) => arr.findIndex((x) => x.uri === item.uri) === index
  );
}

export const clipboardService = {
  get(): ClipboardState | null {
    return storageService.getClipboard();
  },

  set(items: FileEntry[], mode: ClipboardMode): ClipboardState {
    const clip: ClipboardState = {
      items: uniqueByUri(items),
      mode,
      createdAt: Date.now(),
    };

    storageService.setClipboard(clip);
    return clip;
  },

  clear() {
    storageService.clearClipboard();
  },

  hasItems(): boolean {
    const clip = this.get();
    return !!clip && Array.isArray(clip.items) && clip.items.length > 0;
  },

  count(): number {
    const clip = this.get();
    return clip?.items?.length || 0;
  },
};