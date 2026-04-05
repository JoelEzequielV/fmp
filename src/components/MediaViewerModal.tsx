import React from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonIcon,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import type { FileEntry } from "../types/files";

interface Props {
  isOpen: boolean;
  item: FileEntry | null;
  previewUrl?: string;
  onClose: () => void;
}

const MediaViewerModal: React.FC<Props> = ({
  isOpen,
  item,
  previewUrl,
  onClose,
}) => {
  if (!item) return null;

  const isImage = item.type === "image";
  const isAudio = item.type === "audio";
  const isVideo = item.type === "video";

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{item.name}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="flex items-center justify-center min-h-full">
          {isImage && previewUrl && (
            <img
              src={previewUrl}
              alt={item.name}
              className="max-w-full max-h-[80vh] rounded-2xl shadow"
            />
          )}

          {isAudio && previewUrl && (
            <div className="w-full max-w-xl">
              <audio controls className="w-full">
                <source src={previewUrl} type={item.mimeType || "audio/*"} />
                Tu navegador no soporta audio.
              </audio>
            </div>
          )}

          {isVideo && previewUrl && (
            <div className="w-full max-w-4xl">
              <video controls className="w-full rounded-2xl shadow">
                <source src={previewUrl} type={item.mimeType || "video/*"} />
                Tu navegador no soporta video.
              </video>
            </div>
          )}

          {!isImage && !isAudio && !isVideo && (
            <p className="opacity-70">No se puede previsualizar este archivo.</p>
          )}
        </div>
      </IonContent>
    </IonModal>
  );
};

export default MediaViewerModal;