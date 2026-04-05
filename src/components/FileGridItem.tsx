// src/components/FileGridItem.tsx
import React from "react";
import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonCheckbox,
  IonButton,
  IonText,
} from "@ionic/react";
import {
  ellipsisVerticalOutline,
  star,
  starOutline,
} from "ionicons/icons";

import type { FileEntry } from "../types/files";
import { getFileIcon } from "../utils/icons";

interface Props {
  item: FileEntry;
  selected?: boolean;
  favorite?: boolean;
  onClick?: () => void;
  onToggleSelect?: () => void;
  onToggleFavorite?: () => void;
  onMore?: () => void;
}

const formatSize = (size?: number) => {
  if (!size || size <= 0) return "";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let value = size;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
};

const FileGridItem: React.FC<Props> = ({
  item,
  selected = false,
  favorite = false,
  onClick,
  onToggleSelect,
  onToggleFavorite,
  onMore,
}) => {
  return (
    <IonCard
      button
      onClick={onClick}
      className="rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <IonCardContent className="p-4 flex flex-col gap-3 min-h-[160px]">
        <div className="flex items-start justify-between">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect?.();
            }}
          >
            <IonCheckbox checked={selected} />
          </div>

          <div className="flex gap-1">
            <IonButton
              fill="clear"
              size="small"
              color={favorite ? "warning" : "medium"}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite?.();
              }}
            >
              <IonIcon icon={favorite ? star : starOutline} />
            </IonButton>

            <IonButton
              fill="clear"
              size="small"
              color="medium"
              onClick={(e) => {
                e.stopPropagation();
                onMore?.();
              }}
            >
              <IonIcon icon={ellipsisVerticalOutline} />
            </IonButton>
          </div>
        </div>

        <div className="flex justify-center items-center py-2">
          <IonIcon icon={getFileIcon(item.type)} style={{ fontSize: "42px" }} />
        </div>

        <div className="text-center">
          <h3 className="text-sm font-semibold line-clamp-2 m-0">{item.name}</h3>
          <IonText color="medium">
            <p className="text-xs mt-1 mb-0">
              {item.isDirectory ? "Carpeta" : formatSize(item.size)}
            </p>
          </IonText>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default FileGridItem;