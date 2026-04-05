import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from "@ionic/react";
import { useNavigate } from "react-router-dom";
import { storageService } from "../services/storageService";

const Settings: React.FC = () => {
  const navigate = useNavigate();

  const handleClearRecents = () => {
    storageService.clearRecents();
    alert("Recientes eliminados");
  };

  const handleClearClipboard = () => {
    storageService.clearClipboard();
    alert("Portapapeles limpiado");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ajustes</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="space-y-3">
          <IonButton expand="block" fill="outline" onClick={handleClearRecents}>
            Limpiar recientes
          </IonButton>

          <IonButton expand="block" fill="outline" onClick={handleClearClipboard}>
            Limpiar portapapeles
          </IonButton>

          <IonButton expand="block" onClick={() => navigate("/")}>
            Volver
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Settings;