import { IonIcon, IonText } from '@ionic/react';
import { folderOpenOutline } from 'ionicons/icons';

interface Props {
  title?: string;
  subtitle?: string;
}

export default function EmptyState({
  title = 'Sin contenido',
  subtitle = 'No hay elementos para mostrar'
}: Props) {
  return (
    <div className="centered-empty">
      <div style={{ textAlign: 'center', opacity: 0.9 }}>
        <IonIcon icon={folderOpenOutline} style={{ fontSize: 48, marginBottom: 12 }} />
        <IonText>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <p className="muted">{subtitle}</p>
        </IonText>
      </div>
    </div>
  );
}