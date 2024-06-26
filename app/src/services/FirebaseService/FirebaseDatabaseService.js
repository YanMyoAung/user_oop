import { config } from '../../../config/config.js';
import { initializeApp } from 'firebase/app';
import { getDatabase,ref, get, update, remove, push, set } from 'firebase/database';

export class FirebaseDatabaseService {
    #app;
    #db;

    constructor() {
        this.#app = initializeApp(config);
        this.#db = getDatabase(this.#app);
    }

    getDatabaseRef(path) {
        return ref(this.#db, path);
    }

    async create(path, data) {
        try {
            const generatedIdRef = push(this.getDatabaseRef(path));
            await set(generatedIdRef, data);
            return generatedIdRef.key;
        } catch (error) {
            console.error('Error creating data:', error);
            throw error;
        }
    }

    async delete(path,id) {
        try {
            await remove(this.getDatabaseRef(`${path}/${id}`));
        } catch (error) {
            console.error('Error deleting data:', error);
            throw error;
        }
    }

    async update(path, id, data) {
        try {
            await update(this.getDatabaseRef(`${path}/${id}`), data);
        } catch (error) {
            console.error('Error updating data:', error);
            throw error;
        }
    }

    async getByID(path, id) {
        try {
            const snapshot = await get(this.getDatabaseRef(`${path}/${id}`));
            return snapshot.val();
        } catch (error) {
            console.error('Error getting data by ID:', error);
            throw error;
        }
    }

    async get(path){
        try {
            const data = await get(this.getDatabaseRef(path));
            return data.val();
        }catch (error){
            console.error('Error getting data:', error);
            throw error;
        }
    }
}
