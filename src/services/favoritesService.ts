import { Preferences } from '@capacitor/preferences';
import { FileEntry } from '../types/file';

const KEY = 'fm_favorites';

export const favoritesService = {
  async getAll(): Promise<FileEntry[]> {
    const { value } = await Preferences.get({ key: KEY });
    return value ? JSON.parse(value) : [];
  },

  async isFavorite(uri: string): Promise<boolean> {
    const items = await this.getAll();
    return items.some((i) => i.uri === uri);
  },

  async add(item: FileEntry) {
    const items = await this.getAll();
    if (items.some((i) => i.uri === item.uri)) return;
    items.unshift(item);
    await Preferences.set({ key: KEY, value: JSON.stringify(items) });
  },

  async remove(uri: string) {
    const items = await this.getAll();
    const updated = items.filter((i) => i.uri !== uri);
    await Preferences.set({ key: KEY, value: JSON.stringify(updated) });
  },

  async toggle(item: FileEntry): Promise<boolean> {
    const exists = await this.isFavorite(item.uri);
    if (exists) {
      await this.remove(item.uri);
      return false;
    } else {
      await this.add(item);
      return true;
    }
  },

  async clear() {
    await Preferences.remove({ key: KEY });
  }
};