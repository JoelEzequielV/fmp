// src/components/FileItem.tsx
import React, { useRef } from "react";
import {
  IonItem,
  IonIcon,
  IonLabel,
  IonButton,
  IonCheckbox,
} from "@ionic/react";
import { ellipsisVerticalOutline, star, starOutline } from "ionicons/icons";
import type { FileEntry, ViewMode } from "../types/files";
import { getFileIcon } from "../utils/icons";

interface Props {
  item: FileEntry;
  selected?: boolean;
  selectionMode?: boolean;
  viewMode?: ViewMode;
  onClick?: (item: FileEntry) => void;
  onLongPress?: (item: FileEntry) => void;
  onToggleSelect?: (item: FileEntry) => void;
  onToggleFavorite?: (item: FileEntry) => void;
  onOptions?: (item: FileEntry) => void;
}

const LONG_PRESS_MS = 500;

const FileItem: React.FC<Props> = ({
  item,
  selected,
  selectionMode,
  viewMode = "list",
  onClick,
  onLongPress,
  onToggleSelect,
  onToggleFavorite,
  onOptions,
}) => {
  const timerRef = useRef<number | null>(null);
  const longPressTriggeredRef = useRef(false);

  const startLongPress = () => {
    longPressTriggeredRef.current = false;

    timerRef.current = window.setTimeout(() => {
      longPressTriggeredRef.current = true;
      onLongPress?.(item);
    }, LONG_PRESS_MS);
  };

  const clearLongPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleTap = () => {
    if (longPressTriggeredRef.current) return;
    onClick?.(item);
  };

  if (viewMode === "grid") {
    return (
      <div
        className={`rounded-2xl border p-4 text-center shadow-sm bg-white transition active:scale-[0.98] ${
          selected ? "ring-2 ring-blue-500 border-blue-300" : ""
        }`}
        onClick={handleTap}
        onMouseDown={startLongPress}
        onMouseUp={clearLongPress}
        onMouseLeave={clearLongPress}
        onTouchStart={startLongPress}
        onTouchEnd={clearLongPress}
      >
        <div className="flex justify-between items-start mb-3">
          {selectionMode ? (
            <IonCheckbox
              checked={selected}
              onClick={(e) => e.stopPropagation()}
              onIonChange={() => onToggleSelect?.(item)}
            />
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite?.(item);
              }}
            >
              <IonIcon icon={item.favorite ? star : starOutline} />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOptions?.(item);
            }}
          >
            <IonIcon icon={ellipsisVerticalOutline} />
          </button>
        </div>

        <IonIcon icon={getFileIcon(item.type)} style={{ fontSize: 34 }} />
        <div className="mt-2 font-medium text-sm break-words">{item.name}</div>
      </div>
    );
  }

  return (
    <IonItem
      button
      onClick={handleTap}
      onMouseDown={startLongPress}
      onMouseUp={clearLongPress}
      onMouseLeave={clearLongPress}
      onTouchStart={startLongPress}
      onTouchEnd={clearLongPress}
      className={selected ? "ring-2 ring-blue-500 rounded-xl" : ""}
    >
      {selectionMode && (
        <IonCheckbox
          slot="start"
          checked={selected}
          onClick={(e) => e.stopPropagation()}
          onIonChange={() => onToggleSelect?.(item)}
        />
      )}

      <IonIcon icon={getFileIcon(item.type)} slot="start" />

      <IonLabel>
        <h2>{item.name}</h2>
        <p>{item.isDirectory ? "Carpeta" : item.mimeType || "Archivo"}</p>
      </IonLabel>

      {!selectionMode && (
        <>
          <IonButton
            fill="clear"
            slot="end"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(item);
            }}
          >
            <IonIcon icon={item.favorite ? star : starOutline} />
          </IonButton>

          <IonButton
            fill="clear"
            slot="end"
            onClick={(e) => {
              e.stopPropagation();
              onOptions?.(item);
            }}
          >
            <IonIcon icon={ellipsisVerticalOutline} />
          </IonButton>
        </>
      )}
    </IonItem>
  );
};

export default FileItem;