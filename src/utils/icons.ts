//src/utils/icons.ts
import {
  folderOutline,
  imageOutline,
  videocamOutline,
  musicalNotesOutline,
  archiveOutline,
  logoAndroid,
  documentOutline,
} from "ionicons/icons";
import type { FileType } from "../types/files";

export const getFileIcon = (type: FileType) => {
  switch (type) {
    case "folder":
      return folderOutline;
    case "image":
      return imageOutline;
    case "video":
      return videocamOutline;
    case "audio":
      return musicalNotesOutline;
    case "archive":
      return archiveOutline;
    case "apk":
      return logoAndroid;
    case "file":
    default:
      return documentOutline;
  }
};