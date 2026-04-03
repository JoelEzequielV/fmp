import {
    folderOpenOutline,
    imageOutline,
    videocamOutline,
    musicalNotesOutline,
    documentTextOutline,
    archiveOutline,
    phonePortraitOutline,
    documentOutline
  } from 'ionicons/icons';
  
  import { FileType } from '../types/file';
  
  export function getFileIcon(type: FileType) {
    switch (type) {
      case 'folder':
        return folderOpenOutline;
      case 'image':
        return imageOutline;
      case 'video':
        return videocamOutline;
      case 'audio':
        return musicalNotesOutline;
      case 'document':
        return documentTextOutline;
      case 'archive':
        return archiveOutline;
      case 'apk':
        return phonePortraitOutline;
      default:
        return documentOutline;
    }
  }