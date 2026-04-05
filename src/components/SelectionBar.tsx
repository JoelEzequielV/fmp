// src/components/SelectionBar.tsx
import React from "react";
import { IonButton, IonIcon } from "@ionic/react";
import {
  copyOutline,
  cutOutline,
  trashOutline,
  checkmarkDoneOutline,
  removeCircleOutline,
  closeOutline,
} from "ionicons/icons";

interface Props {
  count: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onCopy: () => void;
  onMove: () => void;
  onDelete: () => void;
  onExit: () => void;
}

const SelectionBar: React.FC<Props> = ({
  count,
  onSelectAll,
  onClearSelection,
  onCopy,
  onMove,
  onDelete,
  onExit,
}) => {
  if (count <= 0) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 px-4 z-50">
      <div className="rounded-3xl bg-white shadow-2xl border border-neutral-200 px-3 py-3 flex flex-wrap justify-center gap-2">
        <IonButton fill="outline" size="small" onClick={onSelectAll}>
          <IonIcon icon={checkmarkDoneOutline} slot="start" />
          Todo
        </IonButton>

        <IonButton fill="outline" size="small" onClick={onClearSelection}>
          <IonIcon icon={removeCircleOutline} slot="start" />
          Limpiar
        </IonButton>

        <IonButton fill="outline" size="small" onClick={onCopy}>
          <IonIcon icon={copyOutline} slot="start" />
          Copiar
        </IonButton>

        <IonButton fill="outline" size="small" onClick={onMove}>
          <IonIcon icon={cutOutline} slot="start" />
          Mover
        </IonButton>

        <IonButton color="danger" size="small" onClick={onDelete}>
          <IonIcon icon={trashOutline} slot="start" />
          Eliminar
        </IonButton>

        <IonButton fill="clear" color="medium" size="small" onClick={onExit}>
          <IonIcon icon={closeOutline} />
        </IonButton>
      </div>
    </div>
  );
};

export default SelectionBar;