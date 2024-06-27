import { uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { ref , getStorage , listAll} from "firebase/storage";
import { initializeApp } from 'firebase/app';
import { config } from "../../../config/config.js";

export class FirebaseStorageService {

    static app = initializeApp(config);
    static storage = getStorage(FirebaseStorageService.app);

    static getDatabaseRef(path) {
        return ref(FirebaseStorageService.storage, path);
    }
    static async uploadAndgetURL(path, profile) {
        try {
            const snapshot = await uploadBytes(FirebaseStorageService.getDatabaseRef(path), profile);
            const url = await getDownloadURL(snapshot.ref);
            return url;
        } catch (error) {
            console.error("Error uploading and getting file URL:", error);
            throw error;
        }
    }

    static async getFiles(path) {
        try {
            const result = await listAll(FirebaseStorageService.getDatabaseRef(path));
            return result.items;
        } catch (error) {
            console.error("Error listing files:", error);
            throw error;
        }
    }

    static async deleteFile(path,url) {
        try {
             await deleteObject(FirebaseStorageService.getDatabaseRef(`${path}/${url}`));
        } catch (error) {
            console.error("Error deleting file:", error);
            throw error;
        }
    }

    
}