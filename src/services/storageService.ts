// src/services/storageService.ts
import type {
  FileEntry,
  RecentItem,
  SavedRoot,
  ViewMode,
} from "../types/files";
import type { ClipboardState } from "../types/clipboard";

const KEYS = {
  favorites: "fm_favorites",
  recents: "fm_recents",
  roots: "fm_roots",
  viewMode: "fm_view_mode",
  clipboard: "fm_clipboard",
};

function safeParse<T>(value: string | null, fallback: T): T {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function uniqueByUri<T extends { uri: string }>(items: T[]): T[] {
  return items.filter(
    (item, index, arr) => arr.findIndex((x) => x.uri === item.uri) === index
  );
}

export const storageService = {
  // =========================================================
  // FAVORITOS
  // =========================================================
  getFavorites(): FileEntry[] {
    return safeParse<FileEntry[]>(localStorage.getItem(KEYS.favorites), []);
  },

  setFavorites(items: FileEntry[]) {
    localStorage.setItem(
      KEYS.favorites,
      JSON.stringify(uniqueByUri(items))
    );
  },

  isFavorite(uri: string): boolean {
    return this.getFavorites().some((item) => item.uri === uri);
  },

  toggleFavorite(item: FileEntry): boolean {
    const favorites = this.getFavorites();
    const exists = favorites.some((f) => f.uri === item.uri);

    if (exists) {
      const updated = favorites.filter((f) => f.uri !== item.uri);
      this.setFavorites(updated);
      return false;
    }

    this.setFavorites([item, ...favorites]);
    return true;
  },

  removeFavorite(uri: string) {
    const updated = this.getFavorites().filter((item) => item.uri !== uri);
    this.setFavorites(updated);
  },

  clearFavorites() {
    localStorage.removeItem(KEYS.favorites);
  },

  // =========================================================
  // RECIENTES
  // =========================================================
  getRecents(): RecentItem[] {
    return safeParse<RecentItem[]>(localStorage.getItem(KEYS.recents), []);
  },

  addRecent(item: FileEntry) {
    const recents = this.getRecents().filter((r) => r.uri !== item.uri);

    const next: RecentItem = {
      ...item,
      openedAt: Date.now(),
    };

    const updated = [next, ...recents].slice(0, 50);
    localStorage.setItem(KEYS.recents, JSON.stringify(updated));
  },

  clearRecents() {
    localStorage.removeItem(KEYS.recents);
  },

  // =========================================================
  // ROOTS / CARPETAS GUARDADAS
  // =========================================================
  getSavedRoots(): SavedRoot[] {
    return safeParse<SavedRoot[]>(localStorage.getItem(KEYS.roots), []);
  },

  // Alias de compatibilidad (por si Home.tsx usa getRoots())
  getRoots(): SavedRoot[] {
    return this.getSavedRoots();
  },

  saveRoot(root: SavedRoot) {
    const roots = this.getSavedRoots().filter((r) => r.uri !== root.uri);
    const updated = [root, ...roots];
    localStorage.setItem(KEYS.roots, JSON.stringify(updated));
  },

  removeRoot(id: string) {
    const updated = this.getSavedRoots().filter((r) => r.id !== id);
    localStorage.setItem(KEYS.roots, JSON.stringify(updated));
  },

  clearRoots() {
    localStorage.removeItem(KEYS.roots);
  },

  // =========================================================
  // VIEW MODE
  // =========================================================
  getViewMode(): ViewMode {
    const mode = localStorage.getItem(KEYS.viewMode);
    return mode === "grid" ? "grid" : "list";
  },

  setViewMode(mode: ViewMode) {
    localStorage.setItem(KEYS.viewMode, mode);
  },

  // =========================================================
  // CLIPBOARD MÚLTIPLE (PACK PRO)
  // =========================================================
  getClipboard(): ClipboardState | null {
    const clipboard = safeParse<ClipboardState | null>(
      localStorage.getItem(KEYS.clipboard),
      null
    );

    if (!clipboard) return null;

    // Blindaje: si viene estructura vieja o rota, no rompe
    if (!Array.isArray(clipboard.items) || clipboard.items.length === 0) {
      return null;
    }

    return {
      ...clipboard,
      items: uniqueByUri(clipboard.items),
    };
  },

  setClipboard(clipboard: ClipboardState | null) {
    if (!clipboard) {
      localStorage.removeItem(KEYS.clipboard);
      return;
    }

    const normalized: ClipboardState = {
      ...clipboard,
      items: uniqueByUri(clipboard.items),
    };

    localStorage.setItem(KEYS.clipboard, JSON.stringify(normalized));
  },

  clearClipboard() {
    localStorage.removeItem(KEYS.clipboard);
  },

  hasClipboard(): boolean {
    return !!this.getClipboard();
  },

  // =========================================================
  // LIMPIEZA TOTAL (útil para debug)
  // =========================================================
  clearAll() {
    localStorage.removeItem(KEYS.favorites);
    localStorage.removeItem(KEYS.recents);
    localStorage.removeItem(KEYS.roots);
    localStorage.removeItem(KEYS.viewMode);
    localStorage.removeItem(KEYS.clipboard);
  },
};