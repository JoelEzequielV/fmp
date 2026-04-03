export const APP_NAME = 'File Manager Pro';

export const LANG_STORAGE_KEY = 'fmp_language';
export const FAVORITES_STORAGE_KEY = 'fmp_favorites';

export const ROOT_KEYS = {
  INTERNAL: 'root_internal',
  SD: 'root_sd'
};

export const SORT_OPTIONS = [
  { key: 'name', label: 'Name' },
  { key: 'date', label: 'Date' },
  { key: 'size', label: 'Size' },
  { key: 'type', label: 'Type' }
] as const;