document.addEventListener('DOMContentLoaded', () => {
    const authContainer = document.getElementById('authContainer');
    const todoContainer = document.getElementById('todoContainer');
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const registerBtn = document.getElementById('registerBtn');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const showLogin = document.getElementById('showLogin');
    const showRegister = document.getElementById('showRegister');
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const userTodoSection = document.getElementById('userTodoSection');
    const adminSection = document.getElementById('adminSection');
    const userList = document.getElementById('userList');
    const adminTaskList = document.getElementById('adminTaskList');
    const todoTitle = document.getElementById('todoTitle');

    let isAdmin = false;

    function checkAuth() {
        fetch('server.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'action=get'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(text => {
            try {
                const data = JSON.parse(text);
                if (data.error === 'Not logged in') {
                    authContainer.style.display = 'block';
                    todoContainer.style.display = 'none';
                } else {
                    authContainer.style.display = 'none';
                    todoContainer.style.display = 'block';
                    if (isAdmin) {
                        todoTitle.textContent = 'Admin Dashboard';
                        userTodoSection.style.display = 'none';
                        adminSection.style.display = 'block';
                        fetchUsers();
                    } else {
                        todoTitle.textContent = 'To-Do List';
                        userTodoSection.style.display = 'block';
                        adminSection.style.display = 'none';
                        fetchTasks();
                    }
                }
            } catch (e) {
                console.error('Failed to parse JSON in checkAuth:', text);
                throw e;
            }
        })
        .catch(error => console.error('Error in checkAuth:', error));
    }

    function fetchTasks() {
        fetch('server.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'action=get'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(text => {
            try {
                const data = JSON.parse(text);
                taskList.innerHTML = '';
                if (data.length === 0) {
                    taskList.innerHTML = '<li>No tasks available</li>';
                } else {
                    data.forEach(task => {
                        const li = document.createElement('li');
                        li.className = task.status === 'completed' ? 'completed' : '';
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.className = 'task-status';
                        checkbox.setAttribute('data-id', task.id);
                        checkbox.checked = task.status === 'completed';
                        const span = document.createElement('span');
                        span.textContent = task.task;
                        const editBtn = document.createElement('button');
                        editBtn.className = 'edit';
                        editBtn.setAttribute('data-id', task.id);
                        editBtn.textContent = 'Edit';
                        const deleteBtn = document.createElement('button');
                        deleteBtn.className = 'delete';
                        deleteBtn.setAttribute('data-id', task.id);
                        deleteBtn.textContent = 'Delete';
                        li.appendChild(checkbox);
                        li.appendChild(span);
                        li.appendChild(editBtn);
                        li.appendChild(deleteBtn);
                        taskList.appendChild(li);
                    });
                }
            } catch (e) {
                console.error('Failed to parse JSON in fetchTasks:', text);
                throw e;
            }
        })
        .catch(error => console.error('Error in fetchTasks:', error));
    }

    function fetchUsers() {
        fetch('server.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'action=get_users'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(text => {
            try {
                const data = JSON.parse(text);
                userList.innerHTML = '';
                if (data.length === 0) {
                    userList.innerHTML = '<li>No users available</li>';
                } else {
                    data.forEach(user => {
                        const li = document.createElement('li');
                        li.setAttribute('data-id', user.id);
                        li.textContent = `${user.username} (${user.email})`;
                        li.addEventListener('click', () => fetchUserTasks(user.id));
                        userList.appendChild(li);
                    });
                }
            } catch (e) {
                console.error('Failed to parse JSON in fetchUsers:', text);
                throw e;
            }
        })
        .catch(error => console.error('Error in fetchUsers:', error));
    }

    function fetchUserTasks(userId) {
        fetch('server.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=get_user_tasks&user_id=${userId}`
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(text => {
            try {
                const data = JSON.parse(text);
                adminTaskList.innerHTML = '';
                if (data.length === 0) {
                    adminTaskList.innerHTML = '<tr><td colspan="4">No tasks available</td></tr>';
                } else {
                    data.forEach(task => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${task.id}</td>
                            <td>${task.task}</td>
                            <td>${task.status}</td>
                            <td>${task.created_at}</td>
                        `;
                        adminTaskList.appendChild(tr);
                    });
                }
            } catch (e) {
                console.error('Failed to parse JSON in fetchUserTasks:', text);
                throw e;
            }
        })
        .catch(error => console.error('Error in fetchUserTasks:', error));
    }

    registerBtn.addEventListener('click', () => {
        const email = document.getElementById('regEmail').value;
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        fetch('register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(text => {
            try {
                const data = JSON.parse(text);
                if (data.success) {
                    document.getElementById('regEmail').value = '';
                    document.getElementById('regUsername').value = '';
                    document.getElementById('regPassword').value = '';
                    authContainer.style.display = 'none';
                    todoContainer.style.display = 'block';
                    fetchTasks();
                } else {
                    alert('Registration failed: ' + data.error);
                }
            } catch (e) {
                console.error('Failed to parse JSON in register:', text);
                throw e;
            }
        })
        .catch(error => console.error('Error in register:', error));
    });

    loginBtn.addEventListener('click', () => {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        fetch('login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(text => {
            try {
                const data = JSON.parse(text);
                if (data.success) {
                    isAdmin = data.is_admin;
                    document.getElementById('loginUsername').value = '';
                    document.getElementById('loginPassword').value = '';
                    authContainer.style.display = 'none';
                    todoContainer.style.display = 'block';
                    if (isAdmin) {
                        todoTitle.textContent = 'Admin Dashboard';
                        userTodoSection.style.display = 'none';
                        adminSection.style.display = 'block';
                        fetchUsers();
                    } else {
                        fetchTasks();
                    }
                } else {
                    alert('Login failed: ' + data.error);
                }
            } catch (e) {
                console.error('Failed to parse JSON in login:', text);
                throw e;
            }
        })
        .catch(error => console.error('Error in login:', error));
    });

    logoutBtn.addEventListener('click', () => {
        fetch('logout.php', { method: 'POST' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(text => {
            try {
                JSON.parse(text);
                isAdmin = false;
                authContainer.style.display = 'block';
                todoContainer.style.display = 'none';
                registerForm.style.display = 'block';
                loginForm.style.display = 'none';
            } catch (e) {
                console.error('Failed to parse JSON in logout:', text);
                throw e;
            }
        })
        .catch(error => console.error('Error in logout:', error));
    });

    addTaskBtn.addEventListener('click', () => {
        const task = taskInput.value.trim();
        if (task) {
            fetch('server.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `action=add&task=${encodeURIComponent(task)}`
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => {
                try {
                    JSON.parse(text);
                    taskInput.value = '';
                    fetchTasks();
                } catch (e) {
                    console.error('Failed to parse JSON in addTask:', text);
                    throw e;
                }
            })
            .catch(error => console.error('Error in addTask:', error));
        }
    });

    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete')) {
            const id = e.target.getAttribute('data-id');
            fetch('server.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `action=delete&id=${id}`
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => {
                try {
                    JSON.parse(text);
                    fetchTasks();
                } catch (e) {
                    console.error('Failed to parse JSON in delete:', text);
                    throw e;
                }
            })
            .catch(error => console.error('Error in delete:', error));
        } else if (e.target.classList.contains('edit')) {
            const id = e.target.getAttribute('data-id');
            const taskText = e.target.previousElementSibling.innerText;
            const newTask = prompt("Edit task:", taskText);
            if (newTask) {
                fetch('server.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `action=update&id=${id}&task=${encodeURIComponent(newTask)}`
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(text => {
                    try {
                        JSON.parse(text);
                        fetchTasks();
                    } catch (e) {
                        console.error('Failed to parse JSON in update:', text);
                        throw e;
                    }
                })
                .catch(error => console.error('Error in update:', error));
            }
        }
    });

    taskList.addEventListener('change', (e) => {
        if (e.target.classList.contains('task-status')) {
            const id = e.target.getAttribute('data-id');
            const status = e.target.checked ? 'completed' : 'pending';
            fetch('server.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `action=updateStatus&id=${id}&status=${status}`
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => {
                try {
                    JSON.parse(text);
                    fetchTasks();
                } catch (e) {
                    console.error('Failed to parse JSON in updateStatus:', text);
                    throw e;
                }
            })
            .catch(error => console.error('Error in updateStatus:', error));
        }
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    checkAuth();
});