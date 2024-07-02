import { Helper } from "../../helpers/helper.js";
import { FirebaseDatabaseService } from "./FirebaseService/FirebaseDatabaseService.js";
import { FirebaseStorageService } from "./FirebaseService/FirebaseStorageService.js";

export class UserService {
    #firebase_db_instance;

    constructor() {
        this.#firebase_db_instance = new FirebaseDatabaseService();
    }

    async getUsers(path) {
        return await this.#firebase_db_instance.get(path);
    }

    async getUserById(path,id) {
        return await this.#firebase_db_instance.getByID(path,id);
    }

    async updateUser(path,id,user) {
        try{
            await this.#firebase_db_instance.update(path,id,user);
        }catch(error){
            console.log("Error Updating User");
            throw error;
        }
    }

    async deleteUser(path,id,url){
        try{
            await this.#firebase_db_instance.delete(path,id);
            await FirebaseStorageService.deleteFile(path,url);
        }catch(error){
            console.log("Error Deleting User");
            throw error;
        }
    }

    async #generateRandomImage(path){
        const files = await FirebaseStorageService.getFiles(path);
        let image_name = Helper.generateUniqueImageName();
        while(files.some(file => file.name === image_name)){
            image_name = Helper.generateUniqueImageName();
        }
        return image_name;
    }

    async createUser(name,age,gender,country,profile,db_path,storage_path) {
        try{
            if(profile.files.length > 0) {
                const file = profile.files[0];
                const storagePath = storage_path + "/";
                const image_name = await this.#generateRandomImage(storagePath);
                const path = storage_path + "/" + image_name;
                const url = await FirebaseStorageService.uploadAndgetURL(path,file);
                const data = {
                    name,
                    age,
                    gender,
                    country,
                    url,
                    image_name
                }
                await this.#firebase_db_instance.create(db_path,data);
            }
        }catch(error){
            console.log("Error Creating User And Uploading Image");
            throw error;
        }
    }
}