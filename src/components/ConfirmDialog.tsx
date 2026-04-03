import { IonAlert } from '@ionic/react';

type Props = {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  isOpen,
  title = 'Confirmar',
  message = '¿Estás seguro?',
  onConfirm,
  onCancel
}: Props) {
  return (
    <IonAlert
      isOpen={isOpen}
      header={title}
      message={message}
      buttons={[
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: onCancel
        },
        {
          text: 'Confirmar',
          role: 'destructive',
          handler: onConfirm
        }
      ]}
      onDidDismiss={onCancel}
    />
  );
}