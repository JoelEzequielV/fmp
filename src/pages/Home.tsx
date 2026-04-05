// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonToast,
} from "@ionic/react";
import {
  addOutline,
  starOutline,
  timeOutline,
  settingsOutline,
} from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import type { SavedRoot } from "../types/files";
import { safService } from "../services/safService";
import { storageService } from "../services/storageService";
import StorageCard from "../components/StorageCard";
import EmptyState from "../components/EmptyState";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [roots, setRoots] = useState<SavedRoot[]>([]);
  const [toast, setToast] = useState("");

  const loadRoots = () => {
    setRoots(storageService.getSavedRoots());
  };

  useEffect(() => {
    loadRoots();
  }, []);

  const handleAddFolder = async () => {
    try {
      const root = await safService.pickDirectory();
      if (!root) return;

      storageService.saveRoot(root);
      loadRoots();
      setToast("Carpeta agregada");
    } catch (error: any) {
      setToast(error?.message || "No se pudo agregar la carpeta");
    }
  };

  const handleOpenRoot = (root: SavedRoot) => {
    navigate("/browser", {
      state: {
        uri: root.uri,
        name: root.name,
      },
    });
  };

  const handleDeleteRoot = async (root: SavedRoot) => {
    storageService.removeRoot(root.id);
    loadRoots();
    setToast("Carpeta quitada");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>File Manager Pro</IonTitle>
          <IonButton slot="end" fill="clear" onClick={() => navigate("/settings")}>
            <IonIcon icon={settingsOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="flex gap-2 mb-4 flex-wrap">
          <IonButton expand="block" onClick={handleAddFolder}>
            <IonIcon icon={addOutline} slot="start" />
            Agregar carpeta
          </IonButton>

          <IonButton
            expand="block"
            fill="outline"
            onClick={() =>
              navigate("/browser", {
                state: { special: "favorites", name: "Favoritos" },
              })
            }
          >
            <IonIcon icon={starOutline} slot="start" />
            Favoritos
          </IonButton>

          <IonButton
            expand="block"
            fill="outline"
            onClick={() =>
              navigate("/browser", {
                state: { special: "recents", name: "Recientes" },
              })
            }
          >
            <IonIcon icon={timeOutline} slot="start" />
            Recientes
          </IonButton>
        </div>

        {roots.length === 0 ? (
          <EmptyState
            title="No agregaste carpetas todavía"
            description="Tocá en 'Agregar carpeta' para empezar a explorar."
          />
        ) : (
          <div className="space-y-3">
            {roots.map((root) => (
              <StorageCard
                key={root.id}
                item={root}
                onOpen={handleOpenRoot}
                onDelete={handleDeleteRoot}
              />
            ))}
          </div>
        )}

        <IonToast
          isOpen={!!toast}
          message={toast}
          duration={1800}
          onDidDismiss={() => setToast("")}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;