//src/components/ActionBar.tsx
import React from "react";
import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import {
  gridOutline,
  listOutline,
  checkmarkDoneOutline,
  checkboxOutline,
  squareOutline,
} from "ionicons/icons";
import type { FilterType, SortMode, ViewMode } from "../types/files";

interface Props {
  search: string;
  sortBy: SortMode;
  filterBy: FilterType;
  viewMode: ViewMode;
  selectionMode?: boolean;
  hasItems?: boolean;
  allSelected?: boolean;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortMode) => void;
  onFilterChange: (value: FilterType) => void;
  onViewModeChange: (value: ViewMode) => void;
  onToggleSelectionMode?: () => void;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
}

const ActionBar: React.FC<Props> = ({
  search,
  sortBy,
  filterBy,
  viewMode,
  selectionMode,
  hasItems,
  allSelected,
  onSearchChange,
  onSortChange,
  onFilterChange,
  onViewModeChange,
  onToggleSelectionMode,
  onSelectAll,
  onClearSelection,
}) => {
  return (
    <div className="space-y-2">
      <IonItem>
        <IonInput
          placeholder="Buscar archivos..."
          value={search}
          onIonInput={(e) => onSearchChange(e.detail.value || "")}
        />
      </IonItem>

      <div className="grid grid-cols-2 gap-2">
        <IonItem>
          <IonLabel>Orden</IonLabel>
          <IonSelect
            value={sortBy}
            onIonChange={(e) => onSortChange(e.detail.value)}
          >
            <IonSelectOption value="name-asc">Nombre A-Z</IonSelectOption>
            <IonSelectOption value="name-desc">Nombre Z-A</IonSelectOption>
            <IonSelectOption value="date-desc">Más recientes</IonSelectOption>
            <IonSelectOption value="date-asc">Más antiguos</IonSelectOption>
            <IonSelectOption value="size-desc">Más grandes</IonSelectOption>
            <IonSelectOption value="size-asc">Más pequeños</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel>Filtro</IonLabel>
          <IonSelect
            value={filterBy}
            onIonChange={(e) => onFilterChange(e.detail.value)}
          >
            <IonSelectOption value="all">Todos</IonSelectOption>
            <IonSelectOption value="folders">Carpetas</IonSelectOption>
            <IonSelectOption value="images">Imágenes</IonSelectOption>
            <IonSelectOption value="videos">Videos</IonSelectOption>
            <IonSelectOption value="audio">Audio</IonSelectOption>
            <IonSelectOption value="documents">Documentos</IonSelectOption>
            <IonSelectOption value="apk">APK</IonSelectOption>
            <IonSelectOption value="archives">Comprimidos</IonSelectOption>
          </IonSelect>
        </IonItem>
      </div>

      <div className="flex flex-wrap gap-2">
        <IonButton
          expand="block"
          fill={viewMode === "list" ? "solid" : "outline"}
          onClick={() => onViewModeChange("list")}
        >
          <IonIcon icon={listOutline} slot="start" />
          Lista
        </IonButton>

        <IonButton
          expand="block"
          fill={viewMode === "grid" ? "solid" : "outline"}
          onClick={() => onViewModeChange("grid")}
        >
          <IonIcon icon={gridOutline} slot="start" />
          Grilla
        </IonButton>

        {onToggleSelectionMode && (
          <IonButton
            expand="block"
            fill={selectionMode ? "solid" : "outline"}
            onClick={onToggleSelectionMode}
          >
            <IonIcon icon={checkmarkDoneOutline} slot="start" />
            Selección
          </IonButton>
        )}
      </div>

      {selectionMode && hasItems && (
        <div className="flex flex-wrap gap-2">
          <IonButton
            fill="outline"
            size="small"
            onClick={onSelectAll}
          >
            <IonIcon
              icon={allSelected ? checkboxOutline : squareOutline}
              slot="start"
            />
            {allSelected ? "Todo seleccionado" : "Seleccionar todo"}
          </IonButton>

          <IonButton
            fill="outline"
            size="small"
            color="medium"
            onClick={onClearSelection}
          >
            Deseleccionar
          </IonButton>
        </div>
      )}
    </div>
  );
};

export default ActionBar;