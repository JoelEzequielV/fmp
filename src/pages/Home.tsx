import {
  IonContent,
  IonPage,
  IonToast,
  IonLoading
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

import AppHeader from '../components/AppHeader';
import StorageCard from '../components/StorageCard';
import { getDefaultStorageCards } from '../services/storageService';
import { safService } from '../services/safService';

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const cards = getDefaultStorageCards();

  useEffect(() => {
    initRoots();
  }, []);

  const initRoots = async () => {
    try {
      await safService.getSavedRootUris();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRootPick = async (key: 'root_internal_uri' | 'root_sd_uri') => {
    try {
      setLoading(true);

      const result = await safService.pickDirectory();
      await safService.saveRootUri(key, result.uri);

      setToast(`Acceso guardado: ${result.name}`);
      return result.uri;
    } catch (error: any) {
      setToast(error?.message || 'No se pudo seleccionar la carpeta');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const openSection = async (kind: string) => {
    try {
      const roots = await safService.getSavedRootUris();

      if (kind === 'internal') {
        let uri = roots.internal;

        if (!uri) {
          uri = await handleRootPick('root_internal_uri');
          if (!uri) return;
        }

        navigate(`/browser?kind=internal&uri=${encodeURIComponent(uri)}`);
        return;
      }

      if (kind === 'sd') {
        let uri = roots.sd;

        if (!uri) {
          uri = await handleRootPick('root_sd_uri');
          if (!uri) return;
        }

        navigate(`/browser?kind=sd&uri=${encodeURIComponent(uri)}`);
        return;
      }

      if (kind === 'images' || kind === 'documents' || kind === 'downloads') {
        let uri = roots.internal;

        if (!uri) {
          uri = await handleRootPick('root_internal_uri');
          if (!uri) return;
        }

        navigate(`/browser?kind=${kind}&uri=${encodeURIComponent(uri)}`);
        return;
      }

      navigate(`/browser?kind=${kind}`);
    } catch (error: any) {
      setToast(error?.message || 'No se pudo abrir la sección');
    }
  };

  return (
    <IonPage>
      <AppHeader title="File Manager Pro" />
      <IonContent fullscreen>
        <div className="page-shell">
          <div className="section-title">{t('home')}</div>

          <div className="grid-cards">
            {cards.map((item) => (
              <StorageCard
                key={item.id}
                item={item}
                onClick={() => openSection(item.kind)}
              />
            ))}
          </div>
        </div>

        <IonLoading isOpen={loading} message="Cargando..." />
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