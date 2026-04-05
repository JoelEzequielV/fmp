import type { FileEntry, RecentEntry } from "../types/files";
import { storageService } from "./storageService";

export const recentService = {
  getAll(): RecentEntry[] {
    return storageService.getRecents();
  },

  add(file: FileEntry) {
    storageService.addRecent(file);
  },

  clear() {
    storageService.clearRecents();
  },
};