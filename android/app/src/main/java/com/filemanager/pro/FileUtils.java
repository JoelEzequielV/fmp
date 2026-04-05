package com.filemanager.pro;

import android.content.ContentResolver;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.ImageDecoder;
import android.media.ThumbnailUtils;
import android.net.Uri;
import android.os.Build;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.webkit.MimeTypeMap;

import androidx.documentfile.provider.DocumentFile;

import com.getcapacitor.JSObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

public class FileUtils {

    // =========================================================
    // DOCUMENT -> JSON
    // =========================================================
    public static JSObject documentToJson(Context context, DocumentFile file) {
        JSObject obj = new JSObject();

        String mimeType = file.isDirectory() ? "inode/directory" : file.getType();
        String type = detectType(file, mimeType);

        obj.put("uri", file.getUri().toString());
        obj.put("name", file.getName() != null ? file.getName() : "Sin nombre");
        obj.put("isDirectory", file.isDirectory());
        obj.put("mimeType", mimeType != null ? mimeType : "");
        obj.put("size", file.length());
        obj.put("modified", file.lastModified());
        obj.put("type", type);

        return obj;
    }

    // =========================================================
    // DETECT TYPE
    // =========================================================
    public static String detectType(DocumentFile file, String mimeType) {
        if (file.isDirectory()) return "folder";
        if (mimeType == null) return "file";

        String lower = mimeType.toLowerCase();

        if (lower.startsWith("image/")) return "image";
        if (lower.startsWith("video/")) return "video";
        if (lower.startsWith("audio/")) return "audio";
        if (lower.contains("zip") || lower.contains("rar") || lower.contains("7z") || lower.contains("tar")) return "archive";
        if (lower.equals("application/vnd.android.package-archive")) return "apk";

        return "file";
    }

    // =========================================================
    // FROM ANY URI
    // =========================================================
    public static DocumentFile fromAnyUri(Context context, Uri uri) {
        try {
            DocumentFile file = DocumentFile.fromSingleUri(context, uri);
            if (file != null && file.exists()) return file;
        } catch (Exception ignored) {}

        try {
            DocumentFile file = DocumentFile.fromTreeUri(context, uri);
            if (file != null && file.exists()) return file;
        } catch (Exception ignored) {}

        return null;
    }

    // =========================================================
    // COPY RECURSIVE
    // =========================================================
    public static void copyDocumentRecursive(Context context, DocumentFile source, DocumentFile targetDir) throws Exception {
        if (source.isDirectory()) {
            DocumentFile newDir = targetDir.findFile(source.getName());
            if (newDir == null) {
                newDir = targetDir.createDirectory(source.getName());
            }

            if (newDir == null) {
                throw new Exception("No se pudo crear carpeta destino");
            }

            for (DocumentFile child : source.listFiles()) {
                copyDocumentRecursive(context, child, newDir);
            }
        } else {
            copySingleFile(context, source, targetDir);
        }
    }

    // =========================================================
    // COPY FILE
    // =========================================================
    public static void copySingleFile(Context context, DocumentFile source, DocumentFile targetDir) throws Exception {
        String mimeType = source.getType();
        String name = source.getName();

        if (name == null || name.trim().isEmpty()) {
            name = "archivo";
        }

        DocumentFile targetFile = targetDir.createFile(
                mimeType != null ? mimeType : "application/octet-stream",
                name
        );

        if (targetFile == null) {
            throw new Exception("No se pudo crear archivo destino");
        }

        ContentResolver resolver = context.getContentResolver();

        try (
                InputStream in = resolver.openInputStream(source.getUri());
                OutputStream out = resolver.openOutputStream(targetFile.getUri())
        ) {
            if (in == null || out == null) {
                throw new Exception("No se pudo abrir flujo de copia");
            }

            byte[] buffer = new byte[8192];
            int len;

            while ((len = in.read(buffer)) > 0) {
                out.write(buffer, 0, len);
            }

            out.flush();
        }
    }

    // =========================================================
    // GENERATE THUMBNAIL
    // =========================================================
    public static byte[] generateThumbnail(Context context, Uri uri, int maxSize) throws Exception {
        Bitmap bitmap;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            ImageDecoder.Source source = ImageDecoder.createSource(context.getContentResolver(), uri);
            bitmap = ImageDecoder.decodeBitmap(source, (decoder, info, src) -> {
                decoder.setTargetSampleSize(1);
            });
        } else {
            bitmap = MediaStore.Images.Media.getBitmap(context.getContentResolver(), uri);
        }

        if (bitmap == null) return null;

        Bitmap scaled = Bitmap.createScaledBitmap(bitmap, maxSize, maxSize, true);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        scaled.compress(Bitmap.CompressFormat.JPEG, 80, baos);

        return baos.toByteArray();
    }
}