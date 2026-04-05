// src/components/EmptyState.tsx
import React from "react";
import { folderOpenOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";

interface Props {
  title?: string;
  description?: string;
  message?: string;
}

const EmptyState: React.FC<Props> = ({
  title = "No hay elementos",
  description,
  message,
}) => {
  const finalDescription = description || message || "No hay contenido disponible.";

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 opacity-80">
      <IonIcon icon={folderOpenOutline} style={{ fontSize: "64px" }} />
      <h2 className="text-xl font-semibold mt-4">{title}</h2>
      <p className="text-sm mt-2 max-w-md">{finalDescription}</p>
    </div>
  );
};

export default EmptyState;