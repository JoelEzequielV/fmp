// src/utils/files.ts
import type { FileEntry } from "../types/files";

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function formatDate(timestamp?: number): string {
  if (!timestamp) return "Sin fecha";

  try {
    return new Date(timestamp).toLocaleString("es-AR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return "Sin fecha";
  }
}

export function getExtension(name: string): string {
  const parts = name.split(".");
  if (parts.length <= 1) return "";
  return parts.pop()?.toLowerCase() || "";
}

export function isImage(file: FileEntry): boolean {
  return file.mimeType?.startsWith("image/") || file.type === "image";
}

export function isVideo(file: FileEntry): boolean {
  return file.mimeType?.startsWith("video/") || file.type === "video";
}

export function isAudio(file: FileEntry): boolean {
  return file.mimeType?.startsWith("audio/") || file.type === "audio";
}