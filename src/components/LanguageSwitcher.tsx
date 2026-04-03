import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import i18n from '../services/i18n';
import { Preferences } from '@capacitor/preferences';
import { LANG_STORAGE_KEY } from '../utils/constants';

export default function LanguageSwitcher() {
  const current = i18n.language || 'es';

  const handleChange = async (lang: string) => {
    await i18n.changeLanguage(lang);
    await Preferences.set({
      key: LANG_STORAGE_KEY,
      value: lang
    });
    window.location.reload();
  };

  return (
    <IonSegment value={current} onIonChange={(e) => handleChange(e.detail.value as string)}>
      <IonSegmentButton value="es">
        <IonLabel>ES</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="en">
        <IonLabel>EN</IonLabel>
      </IonSegmentButton>
    </IonSegment>
  );
}