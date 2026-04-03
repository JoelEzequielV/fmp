import { IonSearchbar } from '@ionic/react';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  return (
    <IonSearchbar
      value={value}
      debounce={200}
      placeholder="Buscar archivos o carpetas"
      onIonInput={(e) => onChange(e.detail.value || '')}
      style={{ paddingLeft: 0, paddingRight: 0 }}
    />
  );
}