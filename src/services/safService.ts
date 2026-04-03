import { registerPlugin } from '@capacitor/core';
import { FileEntry } from '../types/file';

export interface PickDirectoryResult {
  uri: string;
  name: string;
}

export interface DirectoryListResult {
  currentUri: string;
  parentUri?: string;
  items: FileEntry[];
}

interface SavedRootUris {
  internal?: string | null;
  sd?: string | null;
}

interface SafPluginType {
  pickDirectory(): Promise<PickDirectoryResult>;
  listDirectory(options: { uri: string }): Promise<DirectoryListResult>;
  createFolder(options: { parentUri: string; folderName: string }): Promise<{ success: boolean; uri?: string; name?: string }>;
  rename(options: { uri: string; newName: string }): Promise<{ success: boolean; newUri?: string; name?: string }>;
  delete(options: { uri: string }): Promise<{ success: boolean }>;
  copy(options: { sourceUri: string; targetParentUri: string }): Promise<{ success: boolean }>;
  move(options: { sourceUri: string; targetParentUri: string }): Promise<{ success: boolean }>;
  saveRootUri(options: { key: string; uri: string }): Promise<{ success: boolean }>;
  getSavedRootUris(): Promise<SavedRootUris>;
  clearSavedRootUris(): Promise<{ success: boolean }>;
  openFile(options: { uri: string; mimeType?: string }): Promise<{ success: boolean }>;
  shareFile(options: { uri: string; mimeType?: string }): Promise<{ success: boolean }>;
}

const Saf = registerPlugin<SafPluginType>('Saf');

export const safService = {
  async pickDirectory(): Promise<PickDirectoryResult> {
    return await Saf.pickDirectory();
  },
  async listDirectory(uri: string): Promise<DirectoryListResult> {
    return await Saf.listDirectory({ uri });
  },
  async createFolder(parentUri: string, folderName: string) {
    return await Saf.createFolder({ parentUri, folderName });
  },
  async rename(uri: string, newName: string) {
    return await Saf.rename({ uri, newName });
  },
  async delete(uri: string) {
    return await Saf.delete({ uri });
  },
  async copy(sourceUri: string, targetParentUri: string) {
    return await Saf.copy({ sourceUri, targetParentUri });
  },
  async move(sourceUri: string, targetParentUri: string) {
    return await Saf.move({ sourceUri, targetParentUri });
  },
  async saveRootUri(key: string, uri: string) {
    return await Saf.saveRootUri({ key, uri });
  },
  async getSavedRootUris() {
    return await Saf.getSavedRootUris();
  },
  async clearSavedRootUris() {
    return await Saf.clearSavedRootUris();
  },
  async openFile(uri: string, mimeType?: string) {
    return await Saf.openFile({ uri, mimeType });
  },
  async shareFile(uri: string, mimeType?: string) {
    return await Saf.shareFile({ uri, mimeType });
  }
};