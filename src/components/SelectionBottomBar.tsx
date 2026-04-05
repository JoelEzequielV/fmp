// src/components/SelectionBottomBar.tsx
import React from "react";
import { IonButton, IonIcon } from "@ionic/react";
import {
  checkmarkDoneOutline,
  squareOutline,
  copyOutline,
  cutOutline,
  trashOutline,
  closeOutline,
} from "ionicons/icons";

interface Props {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onCopy: () => void;
  onCut: () => void;
  onDelete: () => void;
  onExit: () => void;
}

const SelectionBottomBar: React.FC<Props> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  onCopy,
  onCut,
  onDelete,
  onExit,
}) => {
  if (selectedCount <= 0) return null;

  const allSelected = selectedCount === totalCount && totalCount > 0;

  return (
    <div className="fixed bottom-4 left-0 right-0 px-4 z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-3 flex flex-wrap justify-center gap-2 border">
        <IonButton fill="outline" onClick={allSelected ? onClearSelection : onSelectAll}>
          <IonIcon
            icon={allSelected ? squareOutline : checkmarkDoneOutline}
            slot="start"
          />
          {allSelected ? "Deseleccionar" : "Seleccionar todo"}
        </IonButton>

        <IonButton fill="outline" onClick={onCopy}>
          <IonIcon icon={copyOutline} slot="start" />
          Copiar
        </IonButton>

        <IonButton fill="outline" onClick={onCut}>
          <IonIcon icon={cutOutline} slot="start" />
          Mover
        </IonButton>

        <IonButton color="danger" onClick={onDelete}>
          <IonIcon icon={trashOutline} slot="start" />
          Eliminar
        </IonButton>

        <IonButton fill="clear" color="medium" onClick={onExit}>
          <IonIcon icon={closeOutline} slot="start" />
          Salir
        </IonButton>
      </div>
    </div>
  );
};

export default SelectionBottomBar;