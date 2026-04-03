import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon
  } from '@ionic/react';
  import { settingsOutline, informationCircleOutline } from 'ionicons/icons';
  import { useNavigate } from 'react-router-dom';
  
  interface Props {
    title: string;
  }
  
  export default function AppHeader({ title }: Props) {
    const navigate = useNavigate();
  
    return (
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => navigate('/about')}>
              <IonIcon icon={informationCircleOutline} />
            </IonButton>
            <IonButton onClick={() => navigate('/settings')}>
              <IonIcon icon={settingsOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
    );
  }