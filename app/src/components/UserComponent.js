export class UserComponent{
    static template_users(data) {
        return `<tr>
        <td><img src=${data.url} class="profile_img"/> </td>
        <td>${data.name}</td>
        <td>${data.gender}</td>
        <td>${data.age}</td>
        <td>${data.country}</td>
        <td><button class="delete-btn" data-user-id="${data.id}" data-user-url="${data.image_name}">Delete</button></td>
        <td><button class="update-btn" data-user-id="${data.id}" >Update</button></td>
      </tr>`;
    }

    static template_users_th() {
        return `<tr>
        <th>Profile</th>
        <th>Name</th>
        <th>Gender</th>
        <th>Age</th>
        <th>Country</th>
        <th>Delete</th>
        <th>Update</th>
      </tr>`;
    }
}