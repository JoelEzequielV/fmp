import {
  IonHeader,
  IonToolbar,
  IonTitle
} from '@ionic/react';

interface Props {
  title: string;
  subtitle?: string;
}

export default function AppHeader({ title, subtitle }: Props) {
  return (
    <IonHeader className="fm-header">
      <IonToolbar>
        <div className="fm-header-inner">
          <div>
            <div className="fm-app-kicker">File Manager Pro</div>
            <IonTitle className="fm-title">{title}</IonTitle>
            {subtitle && <div className="fm-subtitle">{subtitle}</div>}
          </div>
        </div>
      </IonToolbar>
    </IonHeader>
  );
}