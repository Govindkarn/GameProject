document.addEventListener('DOMContentLoaded', fetchUsers);

async function fetchUsers() {
    const response = await fetch('/getUserEntity');
    const users = await response.json();
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = ''; // Clear existing rows

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.password}</td>
            <td>
                <button onclick="deleteUser(${user.id})">Delete</button>
                <button onclick="populateUpdateForm(${user.id}, '${user.username}', '${user.password}')">Update</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

function populateUpdateForm(id, username, password) {
    document.getElementById('updateId').value = id;
    document.getElementById('updateUsername').value = username;
    document.getElementById('updatePassword').value = password;
}

async function updateUser(event) {
    event.preventDefault();
    const id = document.getElementById('updateId').value;
    const username = document.getElementById('updateUsername').value;
    const password = document.getElementById('updatePassword').value;

    const userData = { id: parseInt(id), username, password };

    const response = await fetch('/updateUserEntity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (response.ok) {
        alert('User updated successfully!');
        fetchUsers(); // Refresh the user list
    } else {
        alert('Error updating user.');
    }
}

async function deleteUser(id) {
    const response = await fetch(`/deleteUserEntity/${id}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        alert('User deleted successfully!');
        fetchUsers(); // Refresh the user list
    } else {
        alert('Error deleting user.');
    }
}

document.getElementById('updateForm').addEventListener('submit', updateUser);
