import {
  IonContent,
  IonPage,
  IonText,
  IonToast,
  IonLoading,
  IonButton,
  IonIcon,
  IonAlert
} from '@ionic/react';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import {
  arrowBackOutline,
  copyOutline,
  cutOutline,
  pencilOutline,
  trashOutline,
  openOutline,
  shareOutline,
  heartOutline
} from 'ionicons/icons';

import AppHeader from '../components/AppHeader';
import EmptyState from '../components/EmptyState';
import FileItem from '../components/FileItem';
import ActionBar from '../components/ActionBar';
import ConfirmDialog from '../components/ConfirmDialog';
import SearchBar from '../components/SearchBar';
import BottomSelectionBar from '../components/BottomSelectionBar';

import { safService } from '../services/safService';
import { favoritesService } from '../services/favoritesService';
import { FileEntry } from '../types/file';
import { filterByKind, filterBySearch, sortItems, SortMode } from '../utils/filters';

type ClipboardData = {
  mode: 'copy' | 'move';
  items: FileEntry[];
} | null;

export default function Browser() {
  const [searchParams] = useSearchParams();

  const kind = (searchParams.get('kind') || 'internal') as any;
  const initialUri = searchParams.get('uri') || '';

  const [currentUri, setCurrentUri] = useState(initialUri);
  const [parentUri, setParentUri] = useState('');
  const [items, setItems] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [selectedItem, setSelectedItem] = useState<FileEntry | null>(null);

  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [folderName, setFolderName] = useState('');
  const [renameValue, setRenameValue] = useState('');

  const [clipboard, setClipboard] = useState<ClipboardData>(null);

  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('name_asc');

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedUris, setSelectedUris] = useState<string[]>([]);

  const title = useMemo(() => {
    switch (kind) {
      case 'internal':
        return 'Almacenamiento interno';
      case 'sd':
        return 'Tarjeta SD';
      case 'images':
        return 'Imágenes';
      case 'documents':
        return 'Documentos';
      case 'downloads':
        return 'Descargas';
      case 'favorites':
        return 'Favoritos';
      default:
        return 'Explorador';
    }
  }, [kind]);

  useEffect(() => {
    if (kind === 'favorites') {
      loadFavorites();
      return;
    }

    if (initialUri) {
      loadDirectory(initialUri);
    }
  }, [initialUri, kind]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favs = await favoritesService.getAll();
      setItems(favs);
      setCurrentUri('');
      setParentUri('');
    } catch (error: any) {
      setToast(error?.message || 'No se pudieron cargar favoritos');
    } finally {
      setLoading(false);
    }
  };

  const loadDirectory = async (uri: string) => {
    try {
      setLoading(true);
      const result = await safService.listDirectory(uri);

      setCurrentUri(result.currentUri);
      setParentUri(result.parentUri || '');
      setItems(result.items);
      setSelectedItem(null);
      setSelectionMode(false);
      setSelectedUris([]);
    } catch (error: any) {
      console.error(error);
      setToast(error?.message || 'No se pudo cargar la carpeta');
    } finally {
      setLoading(false);
    }
  };

  const visibleItems = useMemo(() => {
    let data = [...items];

    if (kind === 'images' || kind === 'documents' || kind === 'downloads') {
      data = filterByKind(data, kind);
    }

    data = filterBySearch(data, search);
    data = sortItems(data, sortMode);

    return data;
  }, [items, kind, search, sortMode]);

  const openItem = async (item: FileEntry) => {
    if (kind === 'favorites' && item.isDirectory) {
      await loadDirectory(item.uri);
      return;
    }

    if (item.isDirectory) {
      await loadDirectory(item.uri);
      return;
    }

    try {
      await safService.openFile(item.uri, item.mimeType || '*/*');
    } catch (error: any) {
      setToast(error?.message || 'No se pudo abrir el archivo');
    }
  };

  const goBackFolder = async () => {
    if (!parentUri) return;
    await loadDirectory(parentUri);
  };

  const createFolder = async (nameOverride?: string) => {
    const finalName = (nameOverride ?? folderName).trim();
    if (!finalName) return;

    try {
      setLoading(true);
      await safService.createFolder(currentUri, finalName);
      setToast('Carpeta creada');
      setFolderName('');
      setShowCreateFolder(false);
      await loadDirectory(currentUri);
    } catch (error: any) {
      setToast(error?.message || 'No se pudo crear la carpeta');
    } finally {
      setLoading(false);
    }
  };

  const renameItem = async (newNameOverride?: string) => {
    const finalName = (newNameOverride ?? renameValue).trim();
    if (!selectedItem || !finalName) return;

    try {
      setLoading(true);
      await safService.rename(selectedItem.uri, finalName);
      setToast('Renombrado correctamente');
      setShowRename(false);
      setRenameValue('');
      setSelectedItem(null);
      await loadDirectory(currentUri);
    } catch (error: any) {
      setToast(error?.message || 'No se pudo renombrar');
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async () => {
    if (!selectedItem) return;

    try {
      setLoading(true);
      await safService.delete(selectedItem.uri);
      setToast('Elemento eliminado');
      setShowDeleteConfirm(false);
      setSelectedItem(null);

      if (kind === 'favorites') {
        await favoritesService.remove(selectedItem.uri);
        await loadFavorites();
      } else {
        await loadDirectory(currentUri);
      }
    } catch (error: any) {
      setToast(error?.message || 'No se pudo eliminar');
    } finally {
      setLoading(false);
    }
  };

  const copyItems = (entries: FileEntry[]) => {
    setClipboard({ mode: 'copy', items: entries });
    setToast(`${entries.length} elemento(s) copiados`);
  };

  const cutItems = (entries: FileEntry[]) => {
    setClipboard({ mode: 'move', items: entries });
    setToast(`${entries.length} elemento(s) listos para mover`);
  };

  const pasteItems = async () => {
    if (!clipboard || !currentUri) return;

    try {
      setLoading(true);

      for (const item of clipboard.items) {
        if (clipboard.mode === 'copy') {
          await safService.copy(item.uri, currentUri);
        } else {
          await safService.move(item.uri, currentUri);
        }
      }

      setToast(clipboard.mode === 'copy' ? 'Elementos copiados' : 'Elementos movidos');
      setClipboard(null);
      await loadDirectory(currentUri);
    } catch (error: any) {
      setToast(error?.message || 'No se pudo pegar');
    } finally {
      setLoading(false);
    }
  };

  const clearClipboard = () => {
    setClipboard(null);
    setToast('Portapapeles limpiado');
  };

  const openActions = (item: FileEntry) => {
    setSelectedItem(item);
  };

  const toggleSelection = (item: FileEntry) => {
    setSelectionMode(true);
    setSelectedUris((prev) =>
      prev.includes(item.uri) ? prev.filter((u) => u !== item.uri) : [...prev, item.uri]
    );
  };

  const selectedItems = visibleItems.filter((i) => selectedUris.includes(i.uri));

  const cancelSelection = () => {
    setSelectionMode(false);
    setSelectedUris([]);
  };

  const deleteSelected = async () => {
    try {
      setLoading(true);
      for (const item of selectedItems) {
        await safService.delete(item.uri);
      }
      setToast('Elementos eliminados');
      cancelSelection();
      await loadDirectory(currentUri);
    } catch (error: any) {
      setToast(error?.message || 'No se pudieron eliminar');
    } finally {
      setLoading(false);
    }
  };

  const favoriteSelected = async () => {
    try {
      for (const item of selectedItems) {
        await favoritesService.add(item);
      }
      setToast('Agregados a favoritos');
      cancelSelection();
    } catch (error: any) {
      setToast(error?.message || 'No se pudo guardar en favoritos');
    }
  };

  const shareItem = async (item: FileEntry) => {
    try {
      await safService.shareFile(item.uri, item.mimeType || '*/*');
    } catch (error: any) {
      setToast(error?.message || 'No se pudo compartir');
    }
  };

  const toggleFavoriteSingle = async (item: FileEntry) => {
    try {
      const active = await favoritesService.toggle(item);
      setToast(active ? 'Agregado a favoritos' : 'Quitado de favoritos');

      if (kind === 'favorites') {
        await loadFavorites();
      }
    } catch (error: any) {
      setToast(error?.message || 'No se pudo actualizar favorito');
    }
  };

  return (
    <IonPage>
      <AppHeader title={title} />
      <IonContent fullscreen>
        <div className="page-shell">
          {currentUri && (
            <>
              <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                <IonButton fill="outline" onClick={goBackFolder} disabled={!parentUri}>
                  <IonIcon icon={arrowBackOutline} slot="start" />
                  Volver
                </IonButton>

                <IonButton
                  fill="outline"
                  onClick={() => {
                    setSelectionMode(!selectionMode);
                    if (selectionMode) setSelectedUris([]);
                  }}
                >
                  {selectionMode ? 'Salir selección' : 'Seleccionar'}
                </IonButton>
              </div>

              <IonText>
                <p className="muted" style={{ fontSize: '.8rem', wordBreak: 'break-all' }}>
                  {currentUri}
                </p>
              </IonText>

              <SearchBar value={search} onChange={setSearch} />

              <ActionBar
                onCreateFolder={() => setShowCreateFolder(true)}
                onRefresh={() => loadDirectory(currentUri)}
                onPaste={pasteItems}
                onClearClipboard={clearClipboard}
                canPaste={!!clipboard}
                sortMode={sortMode}
                onChangeSort={setSortMode}
              />
            </>
          )}

          {kind === 'favorites' && (
            <>
              <SearchBar value={search} onChange={setSearch} />
              <ActionBar
                onCreateFolder={() => {}}
                onRefresh={loadFavorites}
                onPaste={undefined}
                onClearClipboard={undefined}
                canPaste={false}
                sortMode={sortMode}
                onChangeSort={setSortMode}
              />
            </>
          )}

          {!currentUri && kind !== 'favorites' && (
            <EmptyState
              title="Sección no conectada aún"
              subtitle="Primero conectá el almacenamiento interno o la SD."
            />
          )}

          {visibleItems.length === 0 && (
            <EmptyState
              title="Sin resultados"
              subtitle="No hay archivos o carpetas para mostrar."
            />
          )}

          {visibleItems.length > 0 && (
            <div className="file-list">
              {visibleItems.map((item) => (
                <div key={item.id}>
                  <FileItem
                    item={item}
                    onClick={() => openItem(item)}
                    onLongPress={() => openActions(item)}
                    selectable={selectionMode}
                    selected={selectedUris.includes(item.uri)}
                    onToggleSelect={() => toggleSelection(item)}
                  />

                  {!selectionMode && selectedItem?.uri === item.uri && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12, marginTop: -2 }}>
                      <IonButton size="small" fill="outline" onClick={() => copyItems([item])}>
                        <IonIcon icon={copyOutline} slot="start" />
                        Copiar
                      </IonButton>

                      <IonButton size="small" fill="outline" onClick={() => cutItems([item])}>
                        <IonIcon icon={cutOutline} slot="start" />
                        Cortar
                      </IonButton>

                      <IonButton
                        size="small"
                        fill="outline"
                        onClick={() => {
                          setRenameValue(item.name);
                          setShowRename(true);
                        }}
                      >
                        <IonIcon icon={pencilOutline} slot="start" />
                        Renombrar
                      </IonButton>

                      {!item.isDirectory && (
                        <>
                          <IonButton size="small" fill="outline" onClick={() => openItem(item)}>
                            <IonIcon icon={openOutline} slot="start" />
                            Abrir
                          </IonButton>

                          <IonButton size="small" fill="outline" onClick={() => shareItem(item)}>
                            <IonIcon icon={shareOutline} slot="start" />
                            Compartir
                          </IonButton>
                        </>
                      )}

                      <IonButton size="small" fill="outline" onClick={() => toggleFavoriteSingle(item)}>
                        <IonIcon icon={heartOutline} slot="start" />
                        Favorito
                      </IonButton>

                      <IonButton
                        size="small"
                        color="danger"
                        fill="outline"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        <IonIcon icon={trashOutline} slot="start" />
                        Eliminar
                      </IonButton>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {selectionMode && selectedUris.length > 0 && (
            <BottomSelectionBar
              count={selectedUris.length}
              onCopy={() => copyItems(selectedItems)}
              onCut={() => cutItems(selectedItems)}
              onDelete={deleteSelected}
              onFavorite={favoriteSelected}
              onCancel={cancelSelection}
            />
          )}
        </div>

        <IonAlert
          isOpen={showCreateFolder}
          header="Nueva carpeta"
          inputs={[
            {
              name: 'folderName',
              type: 'text',
              placeholder: 'Nombre de la carpeta'
            }
          ]}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                setShowCreateFolder(false);
                setFolderName('');
              }
            },
            {
              text: 'Crear',
              handler: (data) => {
                const value = data.folderName || '';
                setFolderName(value);
                setTimeout(() => createFolder(value), 50);
              }
            }
          ]}
          onDidDismiss={() => {
            setShowCreateFolder(false);
          }}
        />

        <IonAlert
          isOpen={showRename}
          header="Renombrar"
          inputs={[
            {
              name: 'renameValue',
              type: 'text',
              value: renameValue,
              placeholder: 'Nuevo nombre'
            }
          ]}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                setShowRename(false);
                setRenameValue('');
              }
            },
            {
              text: 'Guardar',
              handler: (data) => {
                const value = data.renameValue || '';
                setRenameValue(value);
                setTimeout(() => renameItem(value), 50);
              }
            }
          ]}
          onDidDismiss={() => {
            setShowRename(false);
          }}
        />

        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Eliminar"
          message={`¿Eliminar "${selectedItem?.name || ''}"?`}
          onConfirm={deleteItem}
          onCancel={() => setShowDeleteConfirm(false)}
        />

        <IonLoading isOpen={loading} message="Procesando..." />
        <IonToast
          isOpen={!!toast}
          message={toast}
          duration={2200}
          onDidDismiss={() => setToast('')}
        />
      </IonContent>
    </IonPage>
  );
}