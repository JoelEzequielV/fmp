import { StorageRoot } from '../types/file';

export function getDefaultStorageCards(): StorageRoot[] {
  return [
    {
      id: 'images',
      title: 'Imágenes',
      subtitle: 'Fotos y capturas',
      icon: '/icons/image.png',
      kind: 'images'
    },
    {
      id: 'documents',
      title: 'Documentos',
      subtitle: 'PDF, Word, TXT',
      icon: '/icons/doc.png',
      kind: 'documents'
    },
    {
      id: 'downloads',
      title: 'Descargas',
      subtitle: 'Archivos descargados',
      icon: '/icons/download.png',
      kind: 'downloads'
    },
    {
      id: 'internal',
      title: 'Almacenamiento interno',
      subtitle: 'Memoria del dispositivo',
      icon: '/icons/storage.png',
      kind: 'internal'
    },
    {
      id: 'sd',
      title: 'Tarjeta SD',
      subtitle: 'Si está disponible',
      icon: '/icons/sd.png',
      kind: 'sd'
    },
    {
      id: 'favorites',
      title: 'Favoritos',
      subtitle: 'Accesos rápidos',
      icon: '/icons/favorite.png',
      kind: 'favorites'
    }
  ];
}