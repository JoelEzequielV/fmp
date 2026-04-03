export function formatBytes(bytes: number = 0): string {
  if (!bytes || bytes <= 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let value = bytes;

  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }

  return `${value.toFixed(value < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

export function formatDate(timestamp?: number): string {
  if (!timestamp) return 'Sin fecha';

  try {
    return new Date(timestamp).toLocaleString();
  } catch {
    return 'Sin fecha';
  }
}