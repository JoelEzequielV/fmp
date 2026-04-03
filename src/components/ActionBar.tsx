import {
  IonButton,
  IonButtons,
  IonIcon,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import {
  addOutline,
  refreshOutline,
  folderOpenOutline,
  trashOutline
} from 'ionicons/icons';
import { SortMode } from '../utils/filters';

type Props = {
  onCreateFolder: () => void;
  onRefresh: () => void;
  onPaste?: () => void;
  onClearClipboard?: () => void;
  canPaste?: boolean;
  sortMode: SortMode;
  onChangeSort: (mode: SortMode) => void;
};

export default function ActionBar({
  onCreateFolder,
  onRefresh,
  onPaste,
  onClearClipboard,
  canPaste,
  sortMode,
  onChangeSort
}: Props) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14, alignItems: 'center' }}>
      <IonButtons>
        <IonButton onClick={onCreateFolder}>
          <IonIcon icon={addOutline} slot="start" />
          Nueva carpeta
        </IonButton>

        <IonButton onClick={onRefresh}>
          <IonIcon icon={refreshOutline} slot="start" />
          Recargar
        </IonButton>

        {canPaste && (
          <>
            <IonButton onClick={onPaste}>
              <IonIcon icon={folderOpenOutline} slot="start" />
              Pegar
            </IonButton>

            <IonButton color="danger" onClick={onClearClipboard}>
              <IonIcon icon={trashOutline} slot="start" />
              Limpiar
            </IonButton>
          </>
        )}
      </IonButtons>

      <div style={{ minWidth: 180 }}>
        <IonSelect
          interface="popover"
          value={sortMode}
          onIonChange={(e) => onChangeSort(e.detail.value)}
          placeholder="Ordenar"
        >
          <IonSelectOption value="name_asc">Nombre A-Z</IonSelectOption>
          <IonSelectOption value="name_desc">Nombre Z-A</IonSelectOption>
          <IonSelectOption value="date_desc">Más recientes</IonSelectOption>
          <IonSelectOption value="date_asc">Más antiguos</IonSelectOption>
          <IonSelectOption value="size_desc">Más pesados</IonSelectOption>
          <IonSelectOption value="size_asc">Más livianos</IonSelectOption>
        </IonSelect>
      </div>
    </div>
  );
}