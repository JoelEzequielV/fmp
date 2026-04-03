import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Preferences } from '@capacitor/preferences';
import { LANG_STORAGE_KEY } from '../utils/constants';

const resources = {
  es: {
    translation: {
      home: "Inicio",
      browser: "Explorador",
      settings: "Configuración",
      about: "Acerca de",
      images: "Imágenes",
      videos: "Videos",
      audio: "Audio",
      documents: "Documentos",
      downloads: "Descargas",
      internalStorage: "Almacenamiento interno",
      sdCard: "Tarjeta SD",
      favorites: "Favoritos",
      recent: "Recientes",
      language: "Idioma",
      spanish: "Español",
      english: "Inglés",
      search: "Buscar",
      empty: "No hay elementos",
      open: "Abrir",
      rename: "Renombrar",
      delete: "Eliminar",
      copy: "Copiar",
      move: "Mover",
      paste: "Pegar",
      createFolder: "Crear carpeta",
      select: "Seleccionar",
      cancel: "Cancelar",
      save: "Guardar",
      confirm: "Confirmar",
      appDescription: "Administrador de archivos moderno, rápido y profesional."
    }
  },
  en: {
    translation: {
      home: "Home",
      browser: "Browser",
      settings: "Settings",
      about: "About",
      images: "Images",
      videos: "Videos",
      audio: "Audio",
      documents: "Documents",
      downloads: "Downloads",
      internalStorage: "Internal storage",
      sdCard: "SD Card",
      favorites: "Favorites",
      recent: "Recent",
      language: "Language",
      spanish: "Spanish",
      english: "English",
      search: "Search",
      empty: "No items found",
      open: "Open",
      rename: "Rename",
      delete: "Delete",
      copy: "Copy",
      move: "Move",
      paste: "Paste",
      createFolder: "Create folder",
      select: "Select",
      cancel: "Cancel",
      save: "Save",
      confirm: "Confirm",
      appDescription: "Modern, fast and professional file manager."
    }
  }
};

async function getSavedLanguage() {
  const { value } = await Preferences.get({ key: LANG_STORAGE_KEY });
  return value || 'es';
}

(async () => {
  const lang = await getSavedLanguage();

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: lang,
      fallbackLng: 'es',
      interpolation: {
        escapeValue: false
      }
    });
})();

export default i18n;