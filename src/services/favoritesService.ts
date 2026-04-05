// src/services/favoritesService.ts

import type { FileEntry } from "../types/files";

const FAVORITES_KEY = "fm_favorites";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const favoritesService = {
  async getFavorites(): Promise<FileEntry[]> {
    return read<FileEntry[]>(FAVORITES_KEY, []);
  },

  async isFavorite(uri: string): Promise<boolean> {
    const items = await this.getFavorites();
    return items.some((item) => item.uri === uri);
  },

  async addFavorite(entry: FileEntry): Promise<FileEntry[]> {
    const items = await this.getFavorites();

    if (items.some((item) => item.uri === entry.uri)) {
      return items;
    }

    const next = [entry, ...items];
    write(FAVORITES_KEY, next);
    return next;
  },

  async removeFavorite(uri: string): Promise<FileEntry[]> {
    const items = await this.getFavorites();
    const next = items.filter((item) => item.uri !== uri);
    write(FAVORITES_KEY, next);
    return next;
  },

  async toggleFavorite(entry: FileEntry): Promise<{
    favorites: FileEntry[];
    isFavorite: boolean;
  }> {
    const exists = await this.isFavorite(entry.uri);

    if (exists) {
      const favorites = await this.removeFavorite(entry.uri);
      return { favorites, isFavorite: false };
    }

    const favorites = await this.addFavorite(entry);
    return { favorites, isFavorite: true };
  },

  async clearFavorites(): Promise<void> {
    localStorage.removeItem(FAVORITES_KEY);
  },
};