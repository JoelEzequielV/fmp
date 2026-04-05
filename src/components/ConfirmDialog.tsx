// src/components/ConfirmDialog.tsx
import {
  IonAlert,
} from "@ionic/react";

type Props = {
  isOpen: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDialog({
  isOpen,
  title = "Confirmar",
  message = "¿Deseas continuar?",
  onCancel,
  onConfirm,
}: Props) {
  return (
    <IonAlert
      isOpen={isOpen}
      header={title}
      message={message}
      buttons={[
        {
          text: "Cancelar",
          role: "cancel",
          handler: onCancel,
        },
        {
          text: "Aceptar",
          handler: onConfirm,
        },
      ]}
      onDidDismiss={onCancel}
    />
  );
}