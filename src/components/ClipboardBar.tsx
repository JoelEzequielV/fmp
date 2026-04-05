// src/components/ClipboardBar.tsx
import React from "react";
import { IonButton, IonIcon } from "@ionic/react";
import { clipboardOutline, closeOutline } from "ionicons/icons";
import type { ClipboardState } from "../types/clipboard";

interface Props {
  clipboard: ClipboardState | null;
  onPaste: () => void;
  onClear: () => void;
}

const ClipboardBar: React.FC<Props> = ({
  clipboard,
  onPaste,
  onClear,
}) => {
  if (!clipboard || !clipboard.items?.length) return null;

  const total = clipboard.items.length;
  const modeText = clipboard.mode === "copy" ? "Copiar" : "Mover";

  return (
    <div className="mx-3 mb-3 rounded-2xl border bg-white shadow-sm px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
          <IonIcon icon={clipboardOutline} className="text-lg" />
        </div>

        <div className="min-w-0">
          <div className="font-semibold text-sm truncate">
            Portapapeles activo
          </div>
          <div className="text-xs opacity-70 truncate">
            {modeText}: {total} elemento{total !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <div className="flex gap-2 shrink-0">
        <IonButton size="small" onClick={onPaste}>
          Pegar
        </IonButton>

        <IonButton size="small" fill="outline" color="medium" onClick={onClear}>
          <IonIcon icon={closeOutline} />
        </IonButton>
      </div>
    </div>
  );
};

export default ClipboardBar;