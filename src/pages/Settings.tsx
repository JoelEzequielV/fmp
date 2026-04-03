import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonButton,
  IonToast
} from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import AppHeader from '../components/AppHeader';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { safService } from '../services/safService';

export default function Settings() {
  const { t } = useTranslation();
  const [toast, setToast] = useState('');

  const resetAccess = async () => {
    try {
      await safService.clearSavedRootUris();
      setToast('Accesos guardados eliminados');
    } catch (error: any) {
      setToast(error?.message || 'No se pudo limpiar');
    }
  };

  return (
    <IonPage>
      <AppHeader title={t('settings')} />
      <IonContent fullscreen>
        <div className="page-shell">
          <IonList inset>
            <IonItem>
              <IonLabel>
                <h2>{t('language')}</h2>
                <p>Cambiar idioma de la aplicación</p>
              </IonLabel>
            </IonItem>
            <div style={{ padding: 12 }}>
              <LanguageSwitcher />
            </div>

            <IonItem lines="none">
              <IonLabel>
                <h2>Permisos / Accesos</h2>
                <p>Reiniciar carpetas autorizadas</p>
              </IonLabel>
            </IonItem>

            <div style={{ padding: 12 }}>
              <IonButton expand="block" color="danger" onClick={resetAccess}>
                Borrar accesos guardados
              </IonButton>
            </div>
          </IonList>
        </div>

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