package com.filemanager.pro;

import android.content.Intent;
import android.net.Uri;
import android.util.Log;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.documentfile.provider.DocumentFile;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "Saf")
public class SafPlugin extends Plugin {

    private static final String TAG = "SAF_PLUGIN";
    private PluginCall pendingPickDirectoryCall;
    private ActivityResultLauncher<Intent> pickDirectoryLauncher;

    @Override
    public void load() {
        super.load();

        pickDirectoryLauncher = getActivity().registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (pendingPickDirectoryCall == null) return;

                    try {
                        if (result.getResultCode() != android.app.Activity.RESULT_OK || result.getData() == null) {
                            pendingPickDirectoryCall.reject("No se seleccionó ninguna carpeta");
                            pendingPickDirectoryCall = null;
                            return;
                        }

                        Uri treeUri = result.getData().getData();
                        if (treeUri == null) {
                            pendingPickDirectoryCall.reject("URI inválida");
                            pendingPickDirectoryCall = null;
                            return;
                        }

                        final int takeFlags =
                                Intent.FLAG_GRANT_READ_URI_PERMISSION |
                                Intent.FLAG_GRANT_WRITE_URI_PERMISSION;

                        getActivity().getContentResolver().takePersistableUriPermission(treeUri, takeFlags);

                        DocumentFile picked = FileUtils.resolveDocumentFile(getContext(), treeUri);

                        JSObject ret = new JSObject();
                        ret.put("uri", treeUri.toString());
                        ret.put("name", picked != null && picked.getName() != null ? picked.getName() : "Carpeta");

                        pendingPickDirectoryCall.resolve(ret);

                    } catch (Exception e) {
                        Log.e(TAG, "Error seleccionando carpeta", e);
                        pendingPickDirectoryCall.reject("Error seleccionando carpeta: " + e.getMessage());
                    } finally {
                        pendingPickDirectoryCall = null;
                    }
                }
        );
    }

    // =========================
    // PICK DIRECTORY
    // =========================
    @PluginMethod
    public void pickDirectory(PluginCall call) {
        try {
            pendingPickDirectoryCall = call;

            Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
            intent.addFlags(Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);
            intent.addFlags(Intent.FLAG_GRANT_PREFIX_URI_PERMISSION);

            pickDirectoryLauncher.launch(intent);
        } catch (Exception e) {
            Log.e(TAG, "pickDirectory error", e);
            call.reject("No se pudo abrir el selector de carpetas: " + e.getMessage());
        }
    }

    // =========================
    // LIST DIRECTORY
    // =========================
    @PluginMethod
    public void listDirectory(PluginCall call) {
        try {
            String uriString = call.getString("uri");
            if (uriString == null || uriString.trim().isEmpty()) {
                call.reject("URI requerida");
                return;
            }

            Uri uri = Uri.parse(uriString);
            DocumentFile dir = FileUtils.resolveDocumentFile(getContext(), uri);

            if (dir == null || !dir.exists()) {
                call.reject("No se pudo acceder a la carpeta");
                return;
            }

            if (!dir.isDirectory()) {
                call.reject("La URI no es una carpeta");
                return;
            }

            DocumentFile[] files = dir.listFiles();
            JSArray items = new JSArray();

            if (files != null) {
                for (DocumentFile file : files) {
                    items.put(FileUtils.documentToJson(file));
                }
            }

            JSObject ret = new JSObject();
            ret.put("currentUri", dir.getUri().toString());
            ret.put("items", items);

            call.resolve(ret);

        } catch (Exception e) {
            Log.e(TAG, "listDirectory error", e);
            call.reject("No se pudo listar la carpeta: " + e.getMessage());
        }
    }

    // =========================
    // OPEN FILE
    // =========================
    @PluginMethod
    public void openFile(PluginCall call) {
        try {
            String uriString = call.getString("uri");
            String mimeType = call.getString("mimeType");

            if (uriString == null || uriString.trim().isEmpty()) {
                call.reject("URI requerida");
                return;
            }

            Uri uri = Uri.parse(uriString);

            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(uri, mimeType != null ? mimeType : "*/*");
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            getContext().startActivity(intent);

            call.resolve();
        } catch (Exception e) {
            Log.e(TAG, "openFile error", e);
            call.reject("No se pudo abrir el archivo: " + e.getMessage());
        }
    }

    // =========================
    // CREATE FOLDER
    // =========================
    @PluginMethod
    public void createFolder(PluginCall call) {
        try {
            String parentUriString = call.getString("parentUri");
            String name = call.getString("name");

            if (parentUriString == null || parentUriString.trim().isEmpty()) {
                call.reject("parentUri requerida");
                return;
            }

            if (name == null || name.trim().isEmpty()) {
                call.reject("Nombre requerido");
                return;
            }

            Uri parentUri = Uri.parse(parentUriString);
            DocumentFile parent = FileUtils.resolveDocumentFile(getContext(), parentUri);

            if (parent == null || !parent.exists() || !parent.isDirectory()) {
                call.reject("No se pudo acceder a la carpeta padre");
                return;
            }

            DocumentFile existing = FileUtils.findChildByName(parent, name);
            if (existing != null) {
                call.reject("Ya existe una carpeta o archivo con ese nombre");
                return;
            }

            DocumentFile created = parent.createDirectory(name);
            if (created == null) {
                call.reject("No se pudo crear la carpeta");
                return;
            }

            JSObject ret = new JSObject();
            ret.put("uri", created.getUri().toString());
            ret.put("name", created.getName());

            call.resolve(ret);

        } catch (Exception e) {
            Log.e(TAG, "createFolder error", e);
            call.reject("No se pudo crear la carpeta: " + e.getMessage());
        }
    }

    // =========================
    // DELETE
    // =========================
    @PluginMethod
    public void delete(PluginCall call) {
        try {
            String uriString = call.getString("uri");

            if (uriString == null || uriString.trim().isEmpty()) {
                call.reject("URI requerida");
                return;
            }

            Uri uri = Uri.parse(uriString);
            DocumentFile file = FileUtils.resolveDocumentFile(getContext(), uri);

            if (file == null || !file.exists()) {
                call.reject("Archivo o carpeta no encontrado");
                return;
            }

            boolean deleted = FileUtils.deleteRecursive(file);
            if (!deleted) {
                call.reject("No se pudo eliminar");
                return;
            }

            call.resolve();

        } catch (Exception e) {
            Log.e(TAG, "delete error", e);
            call.reject("No se pudo eliminar: " + e.getMessage());
        }
    }

    // =========================
    // RENAME
    // =========================
    @PluginMethod
    public void rename(PluginCall call) {
        try {
            String uriString = call.getString("uri");
            String newName = call.getString("newName");

            if (uriString == null || uriString.trim().isEmpty()) {
                call.reject("URI requerida");
                return;
            }

            if (newName == null || newName.trim().isEmpty()) {
                call.reject("Nuevo nombre requerido");
                return;
            }

            Uri uri = Uri.parse(uriString);
            DocumentFile file = FileUtils.resolveDocumentFile(getContext(), uri);

            if (file == null || !file.exists()) {
                call.reject("Archivo o carpeta no encontrado");
                return;
            }

            boolean ok = file.renameTo(newName.trim());
            if (!ok) {
                call.reject("Could not rename file/folder");
                return;
            }

            JSObject ret = new JSObject();
            ret.put("uri", file.getUri().toString());
            ret.put("name", file.getName());

            call.resolve(ret);

        } catch (Exception e) {
            Log.e(TAG, "rename error", e);
            call.reject("Could not rename file/folder");
        }
    }

    // =========================
    // COPY
    // =========================
    @PluginMethod
    public void copy(PluginCall call) {
        try {
            String sourceUriString = call.getString("sourceUri");
            String targetDirUriString = call.getString("targetDirUri");

            if (sourceUriString == null || targetDirUriString == null) {
                call.reject("sourceUri y targetDirUri requeridos");
                return;
            }

            Uri sourceUri = Uri.parse(sourceUriString);
            Uri targetDirUri = Uri.parse(targetDirUriString);

            DocumentFile source = FileUtils.resolveDocumentFile(getContext(), sourceUri);
            DocumentFile targetDir = FileUtils.resolveDocumentFile(getContext(), targetDirUri);

            if (source == null || !source.exists()) {
                call.reject("Origen no encontrado");
                return;
            }

            if (targetDir == null || !targetDir.exists() || !targetDir.isDirectory()) {
                call.reject("Destino inválido");
                return;
            }

            if (FileUtils.isSameUri(source.getUri(), targetDir.getUri())) {
                call.reject("No se puede copiar dentro de sí mismo");
                return;
            }

            if (source.isDirectory() && FileUtils.isChildOf(source, targetDir)) {
                call.reject("No se puede copiar una carpeta dentro de sí misma");
                return;
            }

            DocumentFile result = FileUtils.copyDocumentRecursive(getContext(), source, targetDir);

            if (result == null) {
                call.reject("No se pudo copiar");
                return;
            }

            JSObject ret = new JSObject();
            ret.put("uri", result.getUri().toString());
            ret.put("name", result.getName());

            call.resolve(ret);

        } catch (Exception e) {
            Log.e(TAG, "copy error", e);
            call.reject("Could not copy file/folder");
        }
    }

    // =========================
    // MOVE
    // =========================
    @PluginMethod
    public void move(PluginCall call) {
        try {
            String sourceUriString = call.getString("sourceUri");
            String targetDirUriString = call.getString("targetDirUri");

            if (sourceUriString == null || targetDirUriString == null) {
                call.reject("sourceUri y targetDirUri requeridos");
                return;
            }

            Uri sourceUri = Uri.parse(sourceUriString);
            Uri targetDirUri = Uri.parse(targetDirUriString);

            DocumentFile source = FileUtils.resolveDocumentFile(getContext(), sourceUri);
            DocumentFile targetDir = FileUtils.resolveDocumentFile(getContext(), targetDirUri);

            if (source == null || !source.exists()) {
                call.reject("Origen no encontrado");
                return;
            }

            if (targetDir == null || !targetDir.exists() || !targetDir.isDirectory()) {
                call.reject("Destino inválido");
                return;
            }

            if (FileUtils.isSameUri(source.getUri(), targetDir.getUri())) {
                call.reject("No se puede mover dentro de sí mismo");
                return;
            }

            if (source.isDirectory() && FileUtils.isChildOf(source, targetDir)) {
                call.reject("No se puede mover una carpeta dentro de sí misma");
                return;
            }

            DocumentFile moved = FileUtils.move(getContext(), source, targetDir);

            JSObject ret = new JSObject();
            ret.put("uri", moved.getUri().toString());
            ret.put("name", moved.getName());

            call.resolve(ret);

        } catch (Exception e) {
            Log.e(TAG, "move error", e);
            call.reject("Could not move file/folder");
        }
    }

    // =========================
    // SHARE FILE
    // =========================
    @PluginMethod
    public void shareFile(PluginCall call) {
        try {
            String uriString = call.getString("uri");
            String mimeType = call.getString("mimeType");

            if (uriString == null || uriString.trim().isEmpty()) {
                call.reject("URI requerida");
                return;
            }

            Uri uri = Uri.parse(uriString);

            Intent shareIntent = new Intent(Intent.ACTION_SEND);
            shareIntent.setType(mimeType != null ? mimeType : "*/*");
            shareIntent.putExtra(Intent.EXTRA_STREAM, uri);
            shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

            Intent chooser = Intent.createChooser(shareIntent, "Compartir archivo");
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            getContext().startActivity(chooser);

            call.resolve();
        } catch (Exception e) {
            Log.e(TAG, "shareFile error", e);
            call.reject("No se pudo compartir el archivo: " + e.getMessage());
        }
    }
}