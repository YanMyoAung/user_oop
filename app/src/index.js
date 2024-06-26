import { UserContainer } from "./containers/UserContainer.js";

const user_container = new UserContainer();

window.addEventListener("load", user_container.getUsers.bind(user_container));
document.getElementById("saveUser").addEventListener("click",() => user_container.createUsers());
document.getElementById('updateUser').addEventListener("click", () => user_container.update_user());

document.getElementsByClassName("close")[0].onclick = function () {
    document.getElementById("myModal").style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == document.getElementById("myModal")) {
        document.getElementById("myModal").style.display = "none";
    }
};