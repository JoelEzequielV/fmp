import { IonButton, IonIcon } from '@ionic/react';
import {
  copyOutline,
  cutOutline,
  trashOutline,
  heartOutline,
  closeOutline
} from 'ionicons/icons';

type Props = {
  count: number;
  onCopy: () => void;
  onCut: () => void;
  onDelete: () => void;
  onFavorite: () => void;
  onCancel: () => void;
};

export default function BottomSelectionBar({
  count,
  onCopy,
  onCut,
  onDelete,
  onFavorite,
  onCancel
}: Props) {
  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 20,
        background: 'var(--ion-background-color)',
        borderTop: '1px solid rgba(255,255,255,.08)',
        padding: '12px 8px',
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        marginTop: 12
      }}
    >
      <div style={{ width: '100%', fontSize: '.9rem', opacity: .8 }}>
        {count} seleccionado(s)
      </div>

      <IonButton size="small" fill="outline" onClick={onCopy}>
        <IonIcon icon={copyOutline} slot="start" />
        Copiar
      </IonButton>

      <IonButton size="small" fill="outline" onClick={onCut}>
        <IonIcon icon={cutOutline} slot="start" />
        Cortar
      </IonButton>

      <IonButton size="small" color="danger" fill="outline" onClick={onDelete}>
        <IonIcon icon={trashOutline} slot="start" />
        Eliminar
      </IonButton>

      <IonButton size="small" fill="outline" onClick={onFavorite}>
        <IonIcon icon={heartOutline} slot="start" />
        Favorito
      </IonButton>

      <IonButton size="small" fill="clear" onClick={onCancel}>
        <IonIcon icon={closeOutline} slot="start" />
        Cancelar
      </IonButton>
    </div>
  );
}