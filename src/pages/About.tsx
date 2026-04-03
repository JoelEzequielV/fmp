import {
    IonContent,
    IonPage,
    IonText
  } from '@ionic/react';
  import AppHeader from '../components/AppHeader';
  
  export default function About() {
    return (
      <IonPage>
        <AppHeader title="Acerca de" />
        <IonContent fullscreen>
          <div className="page-shell">
            <IonText>
              <h2>File Manager Pro v1.0</h2>
              <p className="muted">
                Administrador de archivos Android moderno, minimalista y profesional.
              </p>
  
              <p>
                Esta app está construida con Ionic + React + Capacitor, y usa integración
                nativa Android para manejar archivos y carpetas de forma moderna y compatible.
              </p>
            </IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }