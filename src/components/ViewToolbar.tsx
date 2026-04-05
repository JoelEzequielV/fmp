// src/components/ViewToolbar.tsx
import React from "react";
import {
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton,
  IonIcon,
} from "@ionic/react";
import {
  listOutline,
  gridOutline,
  swapVerticalOutline,
} from "ionicons/icons";
import type { SortMode, ViewMode } from "../types/view";

interface Props {
  sortBy: SortMode;
  viewMode: ViewMode;
  onSortChange: (value: SortMode) => void;
  onViewChange: (value: ViewMode) => void;
}

const ViewToolbar: React.FC<Props> = ({
  sortBy,
  viewMode,
  onSortChange,
  onViewChange,
}) => {
  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex flex-wrap gap-2">
        <IonButton
          size="small"
          fill={sortBy === "name" ? "solid" : "outline"}
          onClick={() => onSortChange("name")}
        >
          <IonIcon icon={swapVerticalOutline} slot="start" />
          Nombre
        </IonButton>

        <IonButton
          size="small"
          fill={sortBy === "modified" ? "solid" : "outline"}
          onClick={() => onSortChange("modified")}
        >
          <IonIcon icon={swapVerticalOutline} slot="start" />
          Fecha
        </IonButton>

        <IonButton
          size="small"
          fill={sortBy === "size" ? "solid" : "outline"}
          onClick={() => onSortChange("size")}
        >
          <IonIcon icon={swapVerticalOutline} slot="start" />
          Tamaño
        </IonButton>
      </div>

      <IonSegment
        value={viewMode}
        onIonChange={(e) => onViewChange((e.detail.value as ViewMode) || "list")}
      >
        <IonSegmentButton value="list">
          <IonIcon icon={listOutline} />
          <IonLabel>Lista</IonLabel>
        </IonSegmentButton>

        <IonSegmentButton value="grid">
          <IonIcon icon={gridOutline} />
          <IonLabel>Grilla</IonLabel>
        </IonSegmentButton>
      </IonSegment>
    </div>
  );
};

export default ViewToolbar;