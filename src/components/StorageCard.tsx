import React from "react";
import { IonButton, IonCard, IonCardContent } from "@ionic/react";
import type { SavedRoot } from "../types/files";

interface Props {
  item: SavedRoot;
  onOpen: (root: SavedRoot) => void;
  onDelete: (root: SavedRoot) => void;
}

const StorageCard: React.FC<Props> = ({ item, onOpen, onDelete }) => {
  return (
    <IonCard>
      <IonCardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">{item.name}</div>
            <div className="text-sm opacity-70 break-all">{item.uri}</div>
          </div>

          <div className="flex gap-2">
            <IonButton size="small" onClick={() => onOpen(item)}>Abrir</IonButton>
            <IonButton size="small" color="danger" fill="outline" onClick={() => onDelete(item)}>
              Quitar
            </IonButton>
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default StorageCard;