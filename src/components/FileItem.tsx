import {
  IonItem,
  IonLabel,
  IonIcon,
  IonNote,
  IonCheckbox
} from '@ionic/react';
import { getFileIcon } from '../utils/icons';
import { FileEntry } from '../types/file';
import { formatBytes, formatDate } from '../utils/format';

type Props = {
  item: FileEntry;
  onClick: () => void;
  onLongPress?: () => void;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
};

export default function FileItem({
  item,
  onClick,
  onLongPress,
  selectable,
  selected,
  onToggleSelect
}: Props) {
  return (
    <IonItem
      button
      detail={item.isDirectory && !selectable}
      onClick={selectable ? onToggleSelect : onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onLongPress?.();
      }}
      style={{
        '--border-radius': '16px',
        marginBottom: '8px'
      } as any}
    >
      {selectable && (
        <IonCheckbox
          slot="start"
          checked={selected}
          onClick={(e) => e.stopPropagation()}
          onIonChange={onToggleSelect}
        />
      )}

      <IonIcon icon={getFileIcon(item.type)} slot="start" />
      <IonLabel>
        <h2>{item.name}</h2>
        <p>
          {item.isDirectory ? 'Carpeta' : formatBytes(item.size)} • {formatDate(item.modified)}
        </p>
      </IonLabel>
      {!item.isDirectory && (
        <IonNote slot="end" color="medium">
          {item.type}
        </IonNote>
      )}
    </IonItem>
  );
}