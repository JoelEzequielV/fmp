package com.filemanager.pro;

import android.content.ContentResolver;
import android.content.Context;
import android.net.Uri;
import android.provider.DocumentsContract;
import android.webkit.MimeTypeMap;

import androidx.documentfile.provider.DocumentFile;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.InputStream;
import java.io.OutputStream;
import java.util.Locale;

public class FileUtils {

    public static JSONObject documentToJson(DocumentFile file, Uri parentUri) throws JSONException {
        JSONObject obj = new JSONObject();

        String name = file.getName() != null ? file.getName() : "unknown";
        String mime = file.getType() != null ? file.getType() : "";
        boolean isDir = file.isDirectory();
        String type = detectType(name, mime, isDir);

        obj.put("id", file.getUri().toString());
        obj.put("name", name);
        obj.put("uri", file.getUri().toString());
        obj.put("path", file.getUri().toString());
        obj.put("type", type);
        obj.put("isDirectory", isDir);
        obj.put("size", file.length());
        obj.put("modified", file.lastModified());
        obj.put("mimeType", mime);
        obj.put("parentUri", parentUri != null ? parentUri.toString() : JSONObject.NULL);
        obj.put("canRead", file.canRead());
        obj.put("canWrite", file.canWrite());

        return obj;
    }

    public static JSONArray listChildren(Context context, Uri treeUri) throws JSONException {
        JSONArray arr = new JSONArray();

        DocumentFile dir = DocumentFile.fromTreeUri(context, treeUri);
        if (dir == null || !dir.exists() || !dir.isDirectory()) {
            return arr;
        }

        DocumentFile[] files = dir.listFiles();
        for (DocumentFile file : files) {
            arr.put(documentToJson(file, treeUri));
        }

        return arr;
    }

    public static String detectType(String name, String mime, boolean isDir) {
        if (isDir) return "folder";

        String lower = name.toLowerCase(Locale.ROOT);

        if (mime.startsWith("image/")) return "image";
        if (mime.startsWith("video/")) return "video";
        if (mime.startsWith("audio/")) return "audio";

        if (
                lower.endsWith(".pdf") ||
                lower.endsWith(".doc") ||
                lower.endsWith(".docx") ||
                lower.endsWith(".txt") ||
                lower.endsWith(".xls") ||
                lower.endsWith(".xlsx") ||
                lower.endsWith(".ppt") ||
                lower.endsWith(".pptx") ||
                lower.endsWith(".csv") ||
                lower.endsWith(".json") ||
                lower.endsWith(".xml") ||
                lower.endsWith(".md")
        ) return "document";

        if (
                lower.endsWith(".zip") ||
                lower.endsWith(".rar") ||
                lower.endsWith(".7z") ||
                lower.endsWith(".tar") ||
                lower.endsWith(".gz")
        ) return "archive";

        if (lower.endsWith(".apk")) return "apk";

        return "other";
    }

    public static DocumentFile findFileByName(DocumentFile parent, String name) {
        if (parent == null || !parent.isDirectory()) return null;

        for (DocumentFile child : parent.listFiles()) {
            if (child.getName() != null && child.getName().equalsIgnoreCase(name)) {
                return child;
            }
        }
        return null;
    }

    public static boolean copyDocument(Context context, Uri sourceUri, Uri targetDirUri) {
        try {
            ContentResolver resolver = context.getContentResolver();

            DocumentFile source = DocumentFile.fromSingleUri(context, sourceUri);
            if (source == null || !source.exists()) return false;

            DocumentFile targetDir = DocumentFile.fromTreeUri(context, targetDirUri);
            if (targetDir == null || !targetDir.exists() || !targetDir.isDirectory()) return false;

            if (source.isDirectory()) {
                DocumentFile newDir = targetDir.createDirectory(source.getName() != null ? source.getName() : "New Folder");
                if (newDir == null) return false;

                for (DocumentFile child : source.listFiles()) {
                    copyDocument(context, child.getUri(), newDir.getUri());
                }
                return true;
            } else {
                String mime = source.getType() != null ? source.getType() : "application/octet-stream";
                String fileName = source.getName() != null ? source.getName() : "file";

                DocumentFile newFile = targetDir.createFile(mime, fileName);
                if (newFile == null) return false;

                InputStream in = resolver.openInputStream(source.getUri());
                OutputStream out = resolver.openOutputStream(newFile.getUri());

                if (in == null || out == null) return false;

                byte[] buffer = new byte[8192];
                int len;
                while ((len = in.read(buffer)) > 0) {
                    out.write(buffer, 0, len);
                }

                in.close();
                out.flush();
                out.close();

                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public static boolean moveDocument(Context context, Uri sourceUri, Uri targetDirUri) {
        boolean copied = copyDocument(context, sourceUri, targetDirUri);
        if (!copied) return false;

        try {
            DocumentFile source = DocumentFile.fromSingleUri(context, sourceUri);
            if (source == null) {
                source = DocumentFile.fromTreeUri(context, sourceUri);
            }
            return source != null && source.delete();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public static Uri getParentUri(Uri currentTreeUri) {
        try {
            String docId = DocumentsContract.getTreeDocumentId(currentTreeUri);

            if (docId == null || !docId.contains("/")) {
                return null;
            }

            String parentDocId = docId.substring(0, docId.lastIndexOf("/"));
            return DocumentsContract.buildTreeDocumentUri(
                    currentTreeUri.getAuthority(),
                    parentDocId
            );
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}