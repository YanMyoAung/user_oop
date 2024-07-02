import { UserService } from "../services/UserService.js";
import { Helper } from "../../helpers/helper.js";
import { UserComponent } from "../components/UserComponent.js";

export class UserContainer {
    #user_instance;
    #db_ref_name;
    #storage_ref_name;

    constructor() {
        this.#user_instance = new UserService();
        this.#db_ref_name = "users";
        this.#storage_ref_name = "users";
    }

    async getUsers() {
        const data = await this.#user_instance.getUsers(this.#db_ref_name);
        if (data !== null) {
            const users = Helper.object_to_array_data(data);
            this.#loadUsersTable(users);
            this.#clearInputFields();
        }
    }

    async #refreshUsers() {
        const data = await this.#user_instance.getUsers(this.#db_ref_name);
        if (data !== null) {
            const users = Helper.object_to_array_data(data);
            this.#loadUsersTable(users);
            this.#clearInputFields();
        } else {
            document.getElementById("customers").innerHTML = "";
        }
    }

    async #update_user_bind(id) {
        const user = await this.#user_instance.getUserById(this.#db_ref_name, id);
        if (user) {
            document.getElementById('upd_name').value = user.name;
            document.getElementById('upd_age').value = user.age;
            document.getElementById('upd_gender').value = user.gender;
            document.getElementById('upd_country').value = user.country;
            document.getElementById('upd_id').value = id;
            document.getElementById("myModal").style.display = "block";
        }
    }

    async #deleteUser(id, url) {
        await this.#user_instance.deleteUser(this.#db_ref_name, id, url);
        this.#refreshUsers();
    }

    async update_user() {
        let id = document.getElementById('upd_id').value;
        if (id) {
            let name = document.getElementById('upd_name').value;
            let age = document.getElementById('upd_age').value;
            let gender = document.getElementById('upd_gender').value;
            let country = document.getElementById('upd_country').value;

            const validationMessage = this.#validateUser(name, age, gender, country);
            if (validationMessage) {
                this.#showMessage(validationMessage, 'error');
                return;
            }

            const updated_user_data = { name, age, gender, country };
            await this.#user_instance.updateUser(this.#db_ref_name, id, updated_user_data);
            this.#refreshUsers();
            this.#showMessage('User updated successfully', 'success');
        }
        document.getElementById("myModal").style.display = "none";
    }

    async createUsers() {
        const name = document.getElementById('fname').value;
        const age = document.getElementById('age').value;
        const gender = document.getElementById('gender').value;
        const country = document.getElementById('country').value;
        const profile = document.getElementById("profile");

        const validationMessage = this.#validateUser(name, age, gender, country);
        if (validationMessage) {
            this.#showMessage(validationMessage, 'error');
            return;
        }

        if (profile.files.length > 0) {
            try {
                await this.#user_instance.createUser(name, age, gender, country, profile, this.#db_ref_name, this.#storage_ref_name);
                this.#refreshUsers();
                this.#clearInputFields();
                this.#showMessage('User created successfully', 'success');
            } catch (err) {
                this.#showMessage("Error creating user: " + err.message, 'error');
            }
        } else {
            this.#showMessage("Profile picture is required", 'error');
        }
    }

    #validateUser(name, age, gender, country) {
        if (!name) return 'Name is required';
        if (!age || isNaN(age) || age <= 0) return 'Valid age is required';
        if (!gender) return 'Gender is required';
        if (!country) return 'Country is required';
        return null;
    }

    #showMessage(message, type) {
        const messageContainer = document.getElementById('message');
        messageContainer.innerText = message;
        messageContainer.className = type; // 'success' or 'error'
        messageContainer.style.display = 'block';
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 5000);
    }

    #clearInputFields() {
        document.getElementById('fname').value = "";
        document.getElementById('age').value = "";
        document.getElementById("profile").value = "";
    }

    #loadUsersTable(users) {
        let usersTable = document.getElementById("customers");
        usersTable.innerHTML = "";
        usersTable.innerHTML += UserComponent.template_users_th();
        if (users !== null) {
            for (const user of users) {
                usersTable.innerHTML += UserComponent.template_users(user);
            }
            this.#attachEventListeners();
        }
    }

    #attachEventListeners() {
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const userId = button.dataset.userId;
                const image_url = button.dataset.userUrl;
                this.#deleteUser(userId, image_url);
            });
        });

        const updateButtons = document.querySelectorAll('.update-btn');
        updateButtons.forEach(button => {
            button.addEventListener('click', () => {
                const userId = button.dataset.userId; // retrieve user id from data attribute
                this.#update_user_bind(userId);
            });
        });
    }
}
