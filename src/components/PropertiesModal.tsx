//src\components\PropertiesModal.tsx
import React from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from "@ionic/react";
import type { FileEntry } from "../types/files";

interface Props {
  isOpen: boolean;
  item: FileEntry | null;
  onClose: () => void;
}

function formatBytes(bytes: number) {
  if (!bytes || bytes <= 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

const PropertiesModal: React.FC<Props> = ({ isOpen, item, onClose }) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Propiedades</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {item ? (
          <div className="space-y-3">
            <p><strong>Nombre:</strong> {item.name}</p>
            <p><strong>URI:</strong> {item.uri}</p>
            <p><strong>Tipo:</strong> {item.isDirectory ? "Carpeta" : item.mimeType || "Archivo"}</p>
            <p><strong>Categoría:</strong> {item.type}</p>
            <p><strong>Tamaño:</strong> {formatBytes(item.size)}</p>
            <p>
              <strong>Modificado:</strong>{" "}
              {item.modified ? new Date(item.modified).toLocaleString() : "-"}
            </p>
          </div>
        ) : (
          <p>No hay información.</p>
        )}

        <div className="mt-6">
          <IonButton expand="block" onClick={onClose}>
            Cerrar
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default PropertiesModal;