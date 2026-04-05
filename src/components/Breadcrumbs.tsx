//src\components\Breadcrumbs.tsx
import React from "react";
import { IonButton } from "@ionic/react";

interface Crumb {
  name: string;
  uri: string;
}

interface Props {
  items: Crumb[];
  onNavigate: (crumb: Crumb, index: number) => void;
}

const Breadcrumbs: React.FC<Props> = ({ items, onNavigate }) => {
  if (!items.length) return null;

  return (
    <div className="px-4 py-2 flex flex-wrap gap-2 text-sm">
      {items.map((crumb, index) => (
        <IonButton
          key={crumb.uri}
          size="small"
          fill="clear"
          onClick={() => onNavigate(crumb, index)}
        >
          {crumb.name}
        </IonButton>
      ))}
    </div>
  );
};

export default Breadcrumbs;