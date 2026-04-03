import { IonCard, IonCardContent, IonText } from '@ionic/react';
import { StorageRoot } from '../types/file';

type Props = {
  item: StorageRoot;
  onClick: () => void;
};

export default function StorageCard({ item, onClick }: Props) {
  return (
    <IonCard className="card-clean clickable" button onClick={onClick}>
      <IonCardContent style={{ padding: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <img
            src={item.icon}
            alt={item.title}
            style={{ width: 34, height: 34, objectFit: 'contain' }}
          />
          <IonText>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
              {item.title}
            </h3>
          </IonText>
          <IonText color="medium">
            <p style={{ margin: 0, fontSize: '.85rem' }}>{item.subtitle}</p>
          </IonText>
        </div>
      </IonCardContent>
    </IonCard>
  );
}