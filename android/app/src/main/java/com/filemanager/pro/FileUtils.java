package com.filemanager.pro;

import android.content.ContentResolver;
import android.content.Context;
import android.net.Uri;
import android.provider.DocumentsContract;
import android.util.Log;
import android.webkit.MimeTypeMap;

import androidx.documentfile.provider.DocumentFile;

import com.getcapacitor.JSObject;

import java.io.InputStream;
import java.io.OutputStream;
import java.util.Locale;

public class FileUtils {

    private static final String TAG = "SAF_FILE_UTILS";

    // =========================
    // RESOLVER DOCUMENTFILE
    // =========================
    public static DocumentFile resolveDocumentFile(Context context, Uri uri) {
        try {
            if (uri == null) return null;

            if (DocumentsContract.isTreeUri(uri)) {
                return DocumentFile.fromTreeUri(context, uri);
            }

            if (DocumentsContract.isDocumentUri(context, uri)) {
                return DocumentFile.fromSingleUri(context, uri);
            }

            return DocumentFile.fromSingleUri(context, uri);

        } catch (Exception e) {
            Log.e(TAG, "resolveDocumentFile error: " + uri, e);
            return null;
        }
    }

    // =========================
    // JSON PARA FRONT
    // =========================
    public static JSObject documentToJson(DocumentFile file) {
        JSObject obj = new JSObject();

        String name = file.getName() != null ? file.getName() : "Sin nombre";
        String mime = file.getType();

        obj.put("id", file.getUri().toString());
        obj.put("uri", file.getUri().toString());
        obj.put("name", name);
        obj.put("isDirectory", file.isDirectory());
        obj.put("mimeType", mime != null ? mime : "");
        obj.put("size", file.isDirectory() ? 0 : file.length());
        obj.put("modified", file.lastModified());
        obj.put("type", file.isDirectory() ? "folder" : detectType(name, mime));

        return obj;
    }

    // =========================
    // BUSCAR HIJO POR NOMBRE
    // =========================
    public static DocumentFile findChildByName(DocumentFile parent, String name) {
        try {
            if (parent == null || !parent.exists() || !parent.isDirectory()) return null;

            for (DocumentFile child : parent.listFiles()) {
                if (child.getName() != null && child.getName().equalsIgnoreCase(name)) {
                    return child;
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "findChildByName error", e);
        }
        return null;
    }

    // =========================
    // COMPARAR URI
    // =========================
    public static boolean isSameUri(Uri a, Uri b) {
        if (a == null || b == null) return false;
        return a.toString().equals(b.toString());
    }

    // =========================
    // SABER SI TARGET ESTÁ DENTRO DEL SOURCE
    // evita copiar/mover carpeta dentro de sí misma
    // =========================
    public static boolean isChildOf(DocumentFile sourceDir, DocumentFile targetDir) {
        if (sourceDir == null || targetDir == null) return false;

        String sourceUri = sourceDir.getUri().toString();
        String targetUri = targetDir.getUri().toString();

        return targetUri.startsWith(sourceUri);
    }

    // =========================
    // COPIAR RECURSIVO
    // =========================
    public static DocumentFile copyDocumentRecursive(Context context, DocumentFile source, DocumentFile targetDir) {
        try {
            if (source == null || !source.exists()) return null;
            if (targetDir == null || !targetDir.exists() || !targetDir.isDirectory()) return null;

            if (source.isDirectory()) {
                return copyDirectory(context, source, targetDir);
            } else {
                return copySingleFile(context, source, targetDir);
            }

        } catch (Exception e) {
            Log.e(TAG, "copyDocumentRecursive error", e);
            return null;
        }
    }

    // =========================
    // COPIAR CARPETA
    // =========================
    public static DocumentFile copyDirectory(Context context, DocumentFile sourceDir, DocumentFile targetDir) {
        try {
            if (sourceDir == null || !sourceDir.exists() || !sourceDir.isDirectory()) return null;
            if (targetDir == null || !targetDir.exists() || !targetDir.isDirectory()) return null;

            String sourceName = safeName(sourceDir.getName(), "Nueva carpeta");
            String uniqueDirName = generateUniqueName(targetDir, sourceName, true);

            DocumentFile newDir = targetDir.createDirectory(uniqueDirName);
            if (newDir == null) {
                Log.e(TAG, "No se pudo crear carpeta destino");
                return null;
            }

            for (DocumentFile child : sourceDir.listFiles()) {
                DocumentFile childResult = copyDocumentRecursive(context, child, newDir);
                if (childResult == null) {
                    Log.e(TAG, "Error copiando hijo: " + child.getName());
                    return null;
                }
            }

            return newDir;

        } catch (Exception e) {
            Log.e(TAG, "copyDirectory error", e);
            return null;
        }
    }

    // =========================
    // COPIAR SOLO ARCHIVO
    // =========================
    public static DocumentFile copySingleFile(Context context, DocumentFile source, DocumentFile targetDir) {
        InputStream in = null;
        OutputStream out = null;

        try {
            if (source == null || !source.exists() || source.isDirectory()) return null;
            if (targetDir == null || !targetDir.exists() || !targetDir.isDirectory()) return null;

            String originalName = safeName(source.getName(), "archivo");
            String mimeType = source.getType();

            if (mimeType == null || mimeType.trim().isEmpty()) {
                mimeType = guessMimeType(originalName);
            }

            String uniqueName = generateUniqueName(targetDir, originalName, false);

            DocumentFile newFile = targetDir.createFile(mimeType, uniqueName);
            if (newFile == null) {
                Log.e(TAG, "No se pudo crear archivo destino");
                return null;
            }

            ContentResolver resolver = context.getContentResolver();

            in = resolver.openInputStream(source.getUri());
            out = resolver.openOutputStream(newFile.getUri(), "w");

            if (in == null || out == null) {
                Log.e(TAG, "No se pudieron abrir streams");
                return null;
            }

            byte[] buffer = new byte[8192];
            int len;

            while ((len = in.read(buffer)) > 0) {
                out.write(buffer, 0, len);
            }

            out.flush();
            return newFile;

        } catch (Exception e) {
            Log.e(TAG, "copySingleFile error", e);
            return null;
        } finally {
            try { if (in != null) in.close(); } catch (Exception ignored) {}
            try { if (out != null) out.close(); } catch (Exception ignored) {}
        }
    }

    // =========================
    // MOVER (COPY + DELETE)
    // =========================
    public static DocumentFile move(Context context, DocumentFile source, DocumentFile targetDir) throws Exception {
        DocumentFile copied = copyDocumentRecursive(context, source, targetDir);

        if (copied == null || !copied.exists()) {
            throw new Exception("Could not move file/folder");
        }

        boolean deleted = deleteRecursive(source);
        if (!deleted) {
            throw new Exception("Copied, but could not remove original");
        }

        return copied;
    }

    // =========================
    // BORRADO RECURSIVO
    // =========================
    public static boolean deleteRecursive(DocumentFile file) {
        try {
            if (file == null || !file.exists()) return false;

            if (file.isDirectory()) {
                for (DocumentFile child : file.listFiles()) {
                    boolean ok = deleteRecursive(child);
                    if (!ok) return false;
                }
            }

            return file.delete();

        } catch (Exception e) {
            Log.e(TAG, "deleteRecursive error", e);
            return false;
        }
    }

    // =========================
    // NOMBRE SEGURO
    // =========================
    public static String safeName(String value, String fallback) {
        if (value == null || value.trim().isEmpty()) return fallback;
        return value.trim();
    }

    // =========================
    // MIME GUESS
    // =========================
    public static String guessMimeType(String fileName) {
        try {
            String ext = "";
            int dot = fileName.lastIndexOf('.');
            if (dot >= 0 && dot < fileName.length() - 1) {
                ext = fileName.substring(dot + 1).toLowerCase(Locale.ROOT);
            }

            String mime = MimeTypeMap.getSingleton().getMimeTypeFromExtension(ext);
            return mime != null ? mime : "application/octet-stream";
        } catch (Exception e) {
            return "application/octet-stream";
        }
    }

    // =========================
    // TIPO VISUAL FRONT
    // =========================
    public static String detectType(String name, String mimeType) {
        String lowerName = name != null ? name.toLowerCase(Locale.ROOT) : "";
        String lowerMime = mimeType != null ? mimeType.toLowerCase(Locale.ROOT) : "";

        if (lowerMime.startsWith("image/")) return "image";
        if (lowerMime.startsWith("video/")) return "video";
        if (lowerMime.startsWith("audio/")) return "audio";
        if (lowerMime.contains("pdf")) return "document";
        if (lowerMime.contains("text")) return "document";
        if (lowerMime.contains("word")) return "document";
        if (lowerMime.contains("sheet")) return "document";
        if (lowerMime.contains("excel")) return "document";
        if (lowerMime.contains("powerpoint")) return "document";
        if (lowerMime.contains("zip") || lowerMime.contains("rar") || lowerMime.contains("7z")) return "archive";
        if (lowerName.endsWith(".apk")) return "apk";

        return "file";
    }

    private static String getBaseName(String fileName) {
        int dot = fileName.lastIndexOf(".");
        if (dot > 0) {
            return fileName.substring(0, dot);
        }
        return fileName;
    }

    private static String getExtension(String fileName) {
        int dot = fileName.lastIndexOf(".");
        if (dot > 0 && dot < fileName.length() - 1) {
            return fileName.substring(dot); // incluye el punto
        }
        return "";
    }

    private static boolean childExists(DocumentFile parent, String name) {
        if (parent == null || !parent.isDirectory()) return false;

        for (DocumentFile child : parent.listFiles()) {
            if (child.getName() != null && child.getName().equalsIgnoreCase(name)) {
                return true;
            }
        }
        return false;
    }

    // =========================
    // GENERAR NOMBRE ÚNICO
    // =========================
    private static String generateUniqueName(DocumentFile targetDir, String originalName, boolean isDirectory) {
        if (targetDir == null || originalName == null || originalName.trim().isEmpty()) {
            return originalName;
        }

        if (!childExists(targetDir, originalName)) {
            return originalName;
        }

        if (isDirectory) {
            int counter = 1;
            String candidate;
            do {
                candidate = originalName + " (" + counter + ")";
                counter++;
            } while (childExists(targetDir, candidate));
            return candidate;
        }

        String baseName = getBaseName(originalName);
        String extension = getExtension(originalName);

        int counter = 1;
        String candidate;
        do {
            candidate = baseName + " (" + counter + ")" + extension;
            counter++;
        } while (childExists(targetDir, candidate));

        return candidate;
    }
}