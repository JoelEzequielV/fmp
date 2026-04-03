package com.filemanager.pro;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;

import androidx.activity.result.ActivityResult;
import androidx.core.content.FileProvider;
import androidx.documentfile.provider.DocumentFile;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONArray;

@CapacitorPlugin(name = "Saf")
public class SafPlugin extends Plugin {

    private static final String PREFS = "file_manager_pro_prefs";
    private static final String KEY_INTERNAL_URI = "root_internal_uri";
    private static final String KEY_SD_URI = "root_sd_uri";

    @PluginMethod
    public void pickDirectory(PluginCall call) {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
        intent.addFlags(
                Intent.FLAG_GRANT_READ_URI_PERMISSION |
                Intent.FLAG_GRANT_WRITE_URI_PERMISSION |
                Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION |
                Intent.FLAG_GRANT_PREFIX_URI_PERMISSION
        );

        startActivityForResult(call, intent, "pickDirectoryResult");
    }

    @ActivityCallback
    private void pickDirectoryResult(PluginCall call, ActivityResult result) {
        if (call == null) return;

        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null) {
            call.reject("Directory selection cancelled");
            return;
        }

        try {
            Uri uri = result.getData().getData();
            if (uri == null) {
                call.reject("Invalid directory URI");
                return;
            }

            getContext().getContentResolver().takePersistableUriPermission(
                    uri,
                    Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION
            );

            DocumentFile dir = DocumentFile.fromTreeUri(getContext(), uri);

            JSObject ret = new JSObject();
            ret.put("uri", uri.toString());
            ret.put("name", dir != null && dir.getName() != null ? dir.getName() : "Storage");

            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Error saving persistent permission: " + e.getMessage());
        }
    }

    @PluginMethod
    public void listDirectory(PluginCall call) {
        String uriString = call.getString("uri");
        if (uriString == null || uriString.isEmpty()) {
            call.reject("Missing directory URI");
            return;
        }

        try {
            Uri uri = Uri.parse(uriString);
            JSONArray items = FileUtils.listChildren(getContext(), uri);
            Uri parentUri = FileUtils.getParentUri(uri);

            JSObject ret = new JSObject();
            ret.put("currentUri", uri.toString());
            ret.put("parentUri", parentUri != null ? parentUri.toString() : null);
            ret.put("items", JSArray.from(items.toString()));

            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Error listing directory: " + e.getMessage());
        }
    }

    @PluginMethod
    public void createFolder(PluginCall call) {
        String parentUriString = call.getString("parentUri");
        String folderName = call.getString("folderName");

        if (parentUriString == null || folderName == null || folderName.trim().isEmpty()) {
            call.reject("Missing parentUri or folderName");
            return;
        }

        try {
            Uri parentUri = Uri.parse(parentUriString);
            DocumentFile parent = DocumentFile.fromTreeUri(getContext(), parentUri);

            if (parent == null || !parent.exists() || !parent.isDirectory()) {
                call.reject("Invalid parent directory");
                return;
            }

            DocumentFile existing = FileUtils.findFileByName(parent, folderName);
            if (existing != null) {
                call.reject("A folder or file with that name already exists");
                return;
            }

            DocumentFile newFolder = parent.createDirectory(folderName);
            if (newFolder == null) {
                call.reject("Could not create folder");
                return;
            }

            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("uri", newFolder.getUri().toString());
            ret.put("name", newFolder.getName());

            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Error creating folder: " + e.getMessage());
        }
    }

    @PluginMethod
    public void rename(PluginCall call) {
        String uriString = call.getString("uri");
        String newName = call.getString("newName");

        if (uriString == null || newName == null || newName.trim().isEmpty()) {
            call.reject("Missing uri or newName");
            return;
        }

        try {
            Uri uri = Uri.parse(uriString);
            DocumentFile file = DocumentFile.fromSingleUri(getContext(), uri);
            if (file == null) {
                file = DocumentFile.fromTreeUri(getContext(), uri);
            }

            if (file == null || !file.exists()) {
                call.reject("File not found");
                return;
            }

            boolean ok = file.renameTo(newName);
            if (!ok) {
                call.reject("Could not rename file/folder");
                return;
            }

            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("newUri", file.getUri().toString());
            ret.put("name", newName);

            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Error renaming: " + e.getMessage());
        }
    }

    @PluginMethod
    public void delete(PluginCall call) {
        String uriString = call.getString("uri");

        if (uriString == null) {
            call.reject("Missing uri");
            return;
        }

        try {
            Uri uri = Uri.parse(uriString);
            DocumentFile file = DocumentFile.fromSingleUri(getContext(), uri);
            if (file == null) {
                file = DocumentFile.fromTreeUri(getContext(), uri);
            }

            if (file == null || !file.exists()) {
                call.reject("File not found");
                return;
            }

            boolean ok = file.delete();

            JSObject ret = new JSObject();
            ret.put("success", ok);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Error deleting: " + e.getMessage());
        }
    }

    @PluginMethod
    public void copy(PluginCall call) {
        String sourceUriString = call.getString("sourceUri");
        String targetParentUriString = call.getString("targetParentUri");

        if (sourceUriString == null || targetParentUriString == null) {
            call.reject("Missing sourceUri or targetParentUri");
            return;
        }

        try {
            boolean ok = FileUtils.copyDocument(
                    getContext(),
                    Uri.parse(sourceUriString),
                    Uri.parse(targetParentUriString)
            );

            JSObject ret = new JSObject();
            ret.put("success", ok);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Error copying: " + e.getMessage());
        }
    }

    @PluginMethod
    public void move(PluginCall call) {
        String sourceUriString = call.getString("sourceUri");
        String targetParentUriString = call.getString("targetParentUri");

        if (sourceUriString == null || targetParentUriString == null) {
            call.reject("Missing sourceUri or targetParentUri");
            return;
        }

        try {
            boolean ok = FileUtils.moveDocument(
                    getContext(),
                    Uri.parse(sourceUriString),
                    Uri.parse(targetParentUriString)
            );

            JSObject ret = new JSObject();
            ret.put("success", ok);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Error moving: " + e.getMessage());
        }
    }

    @PluginMethod
    public void saveRootUri(PluginCall call) {
        String key = call.getString("key");
        String uri = call.getString("uri");

        if (key == null || uri == null) {
            call.reject("Missing key or uri");
            return;
        }

        SharedPreferences prefs = getContext().getSharedPreferences(PREFS, Activity.MODE_PRIVATE);
        prefs.edit().putString(key, uri).apply();

        JSObject ret = new JSObject();
        ret.put("success", true);
        call.resolve(ret);
    }

    @PluginMethod
    public void getSavedRootUris(PluginCall call) {
        SharedPreferences prefs = getContext().getSharedPreferences(PREFS, Activity.MODE_PRIVATE);

        JSObject ret = new JSObject();
        ret.put("internal", prefs.getString(KEY_INTERNAL_URI, null));
        ret.put("sd", prefs.getString(KEY_SD_URI, null));

        call.resolve(ret);
    }

    @PluginMethod
    public void clearSavedRootUris(PluginCall call) {
        SharedPreferences prefs = getContext().getSharedPreferences(PREFS, Activity.MODE_PRIVATE);
        prefs.edit().remove(KEY_INTERNAL_URI).remove(KEY_SD_URI).apply();

        JSObject ret = new JSObject();
        ret.put("success", true);
        call.resolve(ret);
    }

    @PluginMethod
    public void openFile(PluginCall call) {
        String uriString = call.getString("uri");
        String mimeType = call.getString("mimeType", "*/*");

        if (uriString == null) {
            call.reject("Missing uri");
            return;
        }

        try {
            Uri uri = Uri.parse(uriString);

            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(uri, mimeType);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            getContext().startActivity(intent);

            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Error opening file: " + e.getMessage());
        }
    }

    @PluginMethod
    public void shareFile(PluginCall call) {
        String uriString = call.getString("uri");
        String mimeType = call.getString("mimeType", "*/*");

        if (uriString == null) {
            call.reject("Missing uri");
            return;
        }

        try {
            Uri uri = Uri.parse(uriString);

            Intent shareIntent = new Intent(Intent.ACTION_SEND);
            shareIntent.setType(mimeType);
            shareIntent.putExtra(Intent.EXTRA_STREAM, uri);
            shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            shareIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            Intent chooser = Intent.createChooser(shareIntent, "Compartir archivo");
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            getContext().startActivity(chooser);

            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Error sharing file: " + e.getMessage());
        }
    }
}