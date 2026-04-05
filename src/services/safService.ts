//src/services/safService.ts
import { Capacitor } from "@capacitor/core";
import type {
  FileEntry,
  ListDirectoryResult,
  SavedRoot,
} from "../types/files";

type SafPluginType = {
  pickDirectory(): Promise<{ uri: string }>;
  listDirectory(options: { uri: string }): Promise<ListDirectoryResult>;
  openFile(options: { uri: string; mimeType?: string }): Promise<void>;
  createFolder(options: { parentUri: string; name: string }): Promise<any>;
  delete(options: { uri: string }): Promise<void>;
  rename(options: { uri: string; newName: string }): Promise<any>;
  copy(options: { sourceUri: string; targetDirUri: string }): Promise<any>;
  move(options: { sourceUri: string; targetDirUri: string }): Promise<any>;
  shareFile(options: { uri: string; mimeType?: string }): Promise<void>;
  getImagePreview(options: {
    uri: string;
    maxSize?: number;
  }): Promise<{ base64: string; dataUrl: string }>;

  // PACK PRO 10
  createZip(options: {
    sourceUris: string[];
    targetDirUri: string;
    zipName: string;
  }): Promise<any>;

  extractZip(options: {
    zipUri: string;
    targetDirUri: string;
  }): Promise<any>;
};

const Saf: SafPluginType =
  (Capacitor as any)?.Plugins?.Saf ||
  (window as any)?.Capacitor?.Plugins?.Saf;

if (!Saf) {
  console.warn("Saf plugin no disponible todavía");
}

export const safService = {
  async pickDirectory(): Promise<SavedRoot | null> {
    const result = await Saf.pickDirectory();
    if (!result?.uri) return null;

    const uri = result.uri;
    const decoded = decodeURIComponent(uri);
    const parts = decoded.split("/");
    const name = parts[parts.length - 1] || "Carpeta";

    return {
      id: crypto.randomUUID(),
      name,
      uri,
      createdAt: Date.now(),
    };
  },

  async listDirectory(uri: string): Promise<ListDirectoryResult> {
    const result = await Saf.listDirectory({ uri });

    return {
      currentUri: result.currentUri,
      items: (result.items || []).map((item: FileEntry) => ({
        ...item,
        type: item.isDirectory ? "folder" : item.type || "file",
      })),
    };
  },

  async openFile(uri: string, mimeType?: string) {
    return await Saf.openFile({ uri, mimeType });
  },

  async createFolder(parentUri: string, name: string) {
    return await Saf.createFolder({ parentUri, name });
  },

  async delete(uri: string) {
    return await Saf.delete({ uri });
  },

  async rename(uri: string, newName: string) {
    return await Saf.rename({ uri, newName });
  },

  async copy(sourceUri: string, targetDirUri: string) {
    return await Saf.copy({ sourceUri, targetDirUri });
  },

  async move(sourceUri: string, targetDirUri: string) {
    return await Saf.move({ sourceUri, targetDirUri });
  },

  async shareFile(uri: string, mimeType?: string) {
    return await Saf.shareFile({ uri, mimeType });
  },

  async getImagePreview(uri: string, maxSize = 256) {
    return await Saf.getImagePreview({ uri, maxSize });
  },

  // PACK PRO 10
  async createZip(sourceUris: string[], targetDirUri: string, zipName: string) {
    return await Saf.createZip({
      sourceUris,
      targetDirUri,
      zipName,
    });
  },

  async extractZip(zipUri: string, targetDirUri: string) {
    return await Saf.extractZip({
      zipUri,
      targetDirUri,
    });
  },
};