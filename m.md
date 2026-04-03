file-manager-pro/
│
├── android/                      # se crea luego con capacitor
├── public/
│   ├── icons/
│   │   ├── folder.png
│   │   ├── image.png
│   │   ├── video.png
│   │   ├── audio.png
│   │   ├── doc.png
│   │   ├── download.png
│   │   ├── sd.png
│   │   ├── storage.png
│   │   └── favorite.png
│   └── favicon.ico
│
├── src/
│   ├── components/
│   │   ├── AppHeader.tsx
│   │   ├── StorageCard.tsx
│   │   ├── FileItem.tsx
│   │   ├── ActionBar.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── ConfirmDialog.tsx
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Browser.tsx
│   │   ├── Settings.tsx
│   │   └── About.tsx
│   │
│   ├── services/
│   │   ├── safService.ts
│   │   ├── storageService.ts
│   │   ├── favoritesService.ts
│   │   └── i18n.ts
│   │
│   ├── types/
│   │   └── file.ts
│   │
│   ├── utils/
│   │   ├── format.ts
│   │   ├── icons.ts
│   │   └── constants.ts
│   │
│   ├── theme/
│   │   └── variables.css
│   │
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
│
├── capacitor.config.ts
├── tsconfig.json
├── package.json
└── vite.config.ts