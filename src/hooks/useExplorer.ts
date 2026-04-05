import { useCallback, useState } from 'react';
import { FileEntry } from '../types/files';
import { safService } from '../services/safService';

interface ExplorerState {
  currentUri: string | null;
  currentItems: FileEntry[];
  history: string[];
  loading: boolean;
  error: string;
}

export function useExplorer(initialUri?: string | null) {
  const [state, setState] = useState<ExplorerState>({
    currentUri: initialUri || null,
    currentItems: [],
    history: initialUri ? [initialUri] : [],
    loading: false,
    error: ''
  });

  const loadDirectory = useCallback(async (uri: string, pushToHistory = true) => {
    try {
      setState(prev => ({
        ...prev,
        loading: true,
        error: ''
      }));

      const result = await safService.listDirectory(uri);

      const items = Array.isArray(result.items) ? result.items : [];

      setState(prev => ({
        ...prev,
        currentUri: result.currentUri,
        currentItems: items,
        history: pushToHistory
          ? [...prev.history, result.currentUri]
          : prev.history.length === 0
            ? [result.currentUri]
            : prev.history,
        loading: false
      }));

      return result;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error?.message || 'No se pudo cargar la carpeta'
      }));
      throw error;
    }
  }, []);

  const reload = useCallback(async () => {
    if (!state.currentUri) return;
    return await loadDirectory(state.currentUri, false);
  }, [state.currentUri, loadDirectory]);

  const openEntry = useCallback(async (entry: FileEntry) => {
    if (entry.isDirectory) {
      return await loadDirectory(entry.uri, true);
    }

    return await safService.openFile(entry.uri, entry.mimeType);
  }, [loadDirectory]);

  const goBack = useCallback(async () => {
    if (state.history.length <= 1) return false;

    const newHistory = [...state.history];
    newHistory.pop();
    const previousUri = newHistory[newHistory.length - 1];

    try {
      setState(prev => ({
        ...prev,
        loading: true,
        error: ''
      }));

      const result = await safService.listDirectory(previousUri);
      const items = Array.isArray(result.items) ? result.items : [];

      setState(prev => ({
        ...prev,
        currentUri: result.currentUri,
        currentItems: items,
        history: newHistory,
        loading: false
      }));

      return true;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error?.message || 'No se pudo volver atrás'
      }));
      return false;
    }
  }, [state.history]);

  const clearError = () => {
    setState(prev => ({ ...prev, error: '' }));
  };

  return {
    ...state,
    loadDirectory,
    reload,
    openEntry,
    goBack,
    clearError
  };
}