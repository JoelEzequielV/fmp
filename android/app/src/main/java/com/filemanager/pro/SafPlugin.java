package com.filemanager.pro;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.provider.DocumentsContract;
import android.util.Base64;
import android.webkit.MimeTypeMap;

import androidx.activity.result.ActivityResult;
import androidx.documentfile.provider.DocumentFile;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

@CapacitorPlugin(
        name = "Saf",
        permissions = {
                @Permission(alias = "storage", strings = {})
        }
)
public class SafPlugin extends Plugin {

    private PluginCall savedPickDirectoryCall;

    // =========================================================
    // PICK DIRECTORY
    // =========================================================
    @PluginMethod
    public void pickDirectory(PluginCall call) {
        try {
            savedPickDirectoryCall = call;

            Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
            intent.addFlags(
                    Intent.FLAG_GRANT_READ_URI_PERMISSION |
                            Intent.FLAG_GRANT_WRITE_URI_PERMISSION |
                            Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION |
                            Intent.FLAG_GRANT_PREFIX_URI_PERMISSION
            );

            startActivityForResult(call, intent, "handlePickDirectoryResult");
        } catch (Exception e) {
            call.reject("No se pudo abrir el selector de carpetas: " + e.getMessage());
        }
    }

    @SuppressWarnings("unused")
    private void handlePickDirectoryResult(PluginCall call, ActivityResult result) {
        if (savedPickDirectoryCall == null) return;

        PluginCall pluginCall = savedPickDirectoryCall;
        savedPickDirectoryCall = null;

        try {
            if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null) {
                pluginCall.reject("Selección cancelada");
                return;
            }

            Intent data = result.getData();
            Uri treeUri = data.getData();

            if (treeUri == null) {
                pluginCall.reject("No se recibió la carpeta");
                return;
            }

            getContext().getContentResolver().takePersistableUriPermission(
                    treeUri,
                    Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION
            );

            JSObject ret = new JSObject();
            ret.put("uri", treeUri.toString());
            pluginCall.resolve(ret);

        } catch (Exception e) {
            pluginCall.reject("Error al seleccionar carpeta: " + e.getMessage());
        }
    }

    // =========================================================
    // LIST DIRECTORY
    // =========================================================
    @PluginMethod
    public void listDirectory(PluginCall call) {
        String uriString = call.getString("uri");

        if (uriString == null || uriString.trim().isEmpty()) {
            call.reject("URI requerida");
            return;
        }

        try {
            Uri uri = Uri.parse(uriString);
            DocumentFile dir = DocumentFile.fromTreeUri(getContext(), uri);

            if (dir == null || !dir.exists() || !dir.isDirectory()) {
                call.reject("No se pudo listar la carpeta");
                return;
            }

            DocumentFile[] files = dir.listFiles();
            JSArray items = new JSArray();

            if (files != null) {
                for (DocumentFile file : files) {
                    items.put(FileUtils.documentToJson(getContext(), file));
                }
            }

            JSObject ret = new JSObject();
            ret.put("currentUri", uriString);
            ret.put("items", items);
            call.resolve(ret);

        } catch (Exception e) {
            call.reject("No se pudo listar la carpeta: " + e.getMessage());
        }
    }

    // =========================================================
    // OPEN FILE
    // =========================================================
    @PluginMethod
    public void openFile(PluginCall call) {
        String uriString = call.getString("uri");
        String mimeType = call.getString("mimeType", "*/*");

        if (uriString == null || uriString.trim().isEmpty()) {
            call.reject("URI requerida");
            return;
        }

        try {
            Uri uri = Uri.parse(uriString);

            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(uri, mimeType);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            getContext().startActivity(intent);
            call.resolve();

        } catch (Exception e) {
            call.reject("No se pudo abrir el archivo: " + e.getMessage());
        }
    }

    // =========================================================
    // CREATE FOLDER
    // =========================================================
    @PluginMethod
    public void createFolder(PluginCall call) {
        String parentUri = call.getString("parentUri");
        String name = call.getString("name");

        if (parentUri == null || name == null || name.trim().isEmpty()) {
            call.reject("Datos incompletos");
            return;
        }

        try {
            DocumentFile parent = DocumentFile.fromTreeUri(getContext(), Uri.parse(parentUri));

            if (parent == null || !parent.exists() || !parent.isDirectory()) {
                call.reject("Carpeta padre inválida");
                return;
            }

            DocumentFile created = parent.createDirectory(name.trim());

            if (created == null) {
                call.reject("No se pudo crear la carpeta");
                return;
            }

            JSObject ret = new JSObject();
            ret.put("uri", created.getUri().toString());
            ret.put("name", created.getName());
            call.resolve(ret);

        } catch (Exception e) {
            call.reject("No se pudo crear la carpeta: " + e.getMessage());
        }
    }

    // =========================================================
    // DELETE
    // =========================================================
    @PluginMethod
    public void delete(PluginCall call) {
        String uriString = call.getString("uri");

        if (uriString == null) {
            call.reject("URI requerida");
            return;
        }

        try {
            Uri uri = Uri.parse(uriString);
            DocumentFile file = FileUtils.fromAnyUri(getContext(), uri);

            if (file == null || !file.exists()) {
                call.reject("Elemento no encontrado");
                return;
            }

            boolean deleted = file.delete();

            if (!deleted) {
                call.reject("No se pudo eliminar");
                return;
            }

            call.resolve();

        } catch (Exception e) {
            call.reject("No se pudo eliminar: " + e.getMessage());
        }
    }

    // =========================================================
    // RENAME
    // =========================================================
    @PluginMethod
    public void rename(PluginCall call) {
        String uriString = call.getString("uri");
        String newName = call.getString("newName");

        if (uriString == null || newName == null || newName.trim().isEmpty()) {
            call.reject("Datos incompletos");
            return;
        }

        try {
            Uri uri = Uri.parse(uriString);
            DocumentFile file = FileUtils.fromAnyUri(getContext(), uri);

            if (file == null || !file.exists()) {
                call.reject("Archivo no encontrado");
                return;
            }

            boolean renamed = file.renameTo(newName.trim());

            if (!renamed) {
                call.reject("No se pudo renombrar");
                return;
            }

            JSObject ret = new JSObject();
            ret.put("uri", file.getUri().toString());
            ret.put("name", file.getName());
            call.resolve(ret);

        } catch (Exception e) {
            call.reject("No se pudo renombrar: " + e.getMessage());
        }
    }

    // =========================================================
    // COPY
    // =========================================================
    @PluginMethod
    public void copy(PluginCall call) {
        String sourceUri = call.getString("sourceUri");
        String targetDirUri = call.getString("targetDirUri");

        if (sourceUri == null || targetDirUri == null) {
            call.reject("Datos incompletos");
            return;
        }

        try {
            Uri source = Uri.parse(sourceUri);
            Uri target = Uri.parse(targetDirUri);

            DocumentFile sourceFile = FileUtils.fromAnyUri(getContext(), source);
            DocumentFile targetDir = DocumentFile.fromTreeUri(getContext(), target);

            if (sourceFile == null || !sourceFile.exists()) {
                call.reject("Origen no encontrado");
                return;
            }

            if (targetDir == null || !targetDir.exists() || !targetDir.isDirectory()) {
                call.reject("Destino inválido");
                return;
            }

            FileUtils.copyDocumentRecursive(getContext(), sourceFile, targetDir);

            call.resolve();

        } catch (Exception e) {
            call.reject("No se pudo copiar: " + e.getMessage());
        }
    }

    // =========================================================
    // MOVE
    // =========================================================
    @PluginMethod
    public void move(PluginCall call) {
        String sourceUri = call.getString("sourceUri");
        String targetDirUri = call.getString("targetDirUri");

        if (sourceUri == null || targetDirUri == null) {
            call.reject("Datos incompletos");
            return;
        }

        try {
            Uri source = Uri.parse(sourceUri);
            Uri target = Uri.parse(targetDirUri);

            DocumentFile sourceFile = FileUtils.fromAnyUri(getContext(), source);
            DocumentFile targetDir = DocumentFile.fromTreeUri(getContext(), target);

            if (sourceFile == null || !sourceFile.exists()) {
                call.reject("Origen no encontrado");
                return;
            }

            if (targetDir == null || !targetDir.exists() || !targetDir.isDirectory()) {
                call.reject("Destino inválido");
                return;
            }

            FileUtils.copyDocumentRecursive(getContext(), sourceFile, targetDir);
            sourceFile.delete();

            call.resolve();

        } catch (Exception e) {
            call.reject("No se pudo mover: " + e.getMessage());
        }
    }

    // =========================================================
    // SHARE FILE
    // =========================================================
    @PluginMethod
    public void shareFile(PluginCall call) {
        String uriString = call.getString("uri");
        String mimeType = call.getString("mimeType", "*/*");

        if (uriString == null) {
            call.reject("URI requerida");
            return;
        }

        try {
            Uri uri = Uri.parse(uriString);

            Intent intent = new Intent(Intent.ACTION_SEND);
            intent.setType(mimeType);
            intent.putExtra(Intent.EXTRA_STREAM, uri);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

            Intent chooser = Intent.createChooser(intent, "Compartir archivo");
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            getContext().startActivity(chooser);
            call.resolve();

        } catch (Exception e) {
            call.reject("No se pudo compartir: " + e.getMessage());
        }
    }

    // =========================================================
    // IMAGE PREVIEW
    // =========================================================
    @PluginMethod
    public void getImagePreview(PluginCall call) {
        String uriString = call.getString("uri");
        int maxSize = call.getInt("maxSize", 256);

        if (uriString == null || uriString.trim().isEmpty()) {
            call.reject("URI requerida");
            return;
        }

        try {
            Uri uri = Uri.parse(uriString);
            byte[] bytes = FileUtils.generateThumbnail(getContext(), uri, maxSize);

            if (bytes == null || bytes.length == 0) {
                call.reject("No se pudo generar miniatura");
                return;
            }

            String base64 = Base64.encodeToString(bytes, Base64.NO_WRAP);
            String dataUrl = "data:image/jpeg;base64," + base64;

            JSObject ret = new JSObject();
            ret.put("base64", base64);
            ret.put("dataUrl", dataUrl);
            call.resolve(ret);

        } catch (Exception e) {
            call.reject("No se pudo generar preview: " + e.getMessage());
        }
    }
}