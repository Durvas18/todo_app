PHP-Based To-Do List Application
A web-based task management app with authentication and admin control using PHP, MySQL, HTML, CSS, and JavaScript.

---

🔧 Features
• ✅ User Registration & Login
• 👨‍💼 Admin View to Monitor All Users' Tasks
• ➕ Add Task
• 📝 Edit Task
• ❌ Delete Task
• 📌 Mark Task as Completed
• 🔐 Session-based Authentication
• 📊 Admin Dashboard: View tasks by user

---

📁 Folder Structure
├── create_db.php # Initializes MySQL database and tables
├── index.html # Main UI
├── login.php # Handles login logic
├── logout.php # Handles logout
├── register.php # Handles user registration
├── server.php # Handles task CRUD & session validation
├── script.js # Frontend JavaScript logic
├── php_errors.log # Error logging (optional)

---

🚀 How to Run Locally

1. 📥 Download the Project
   Clone the repository or download the ZIP:
   git clone https://github.com/your-username/todo-app.git

---

2. 🛠 Setup the Environment
   • Ensure you have XAMPP or any Apache + MySQL stack installed.
   • Place the project folder in htdocs (XAMPP) or equivalent web root.
   • Start Apache and MySQL from your control panel.

---

3. 🗃️ Create the Database
   Open your browser and visit:
   http://localhost/todo-app/create_db.php
   This will auto-create a MySQL database named todo_app with necessary tables:
   • users – stores user credentials
   • tasks – stores task data

---

4. ▶️ Launch the App
   Visit the main page:
   http://localhost/todo-app/index.html

---

👤 User Roles
• User: Can register, log in, and manage their own tasks.
• Admin: If flagged in the database, can view tasks of all users via the Admin Dashboard.

---

🧪 Sample Admin Setup (Optional)
To manually create an admin user using phpMyAdmin, follow these steps:

1. Open phpMyAdmin from your browser (usually at http://localhost/phpmyadmin).
2. Select the database named todo_app.
3. Go to the users table.
4. Click on the Insert tab to add a new user.
5. Fill in the following details:
   o email: admin@example.com
   o username: admin
   o password: admin123
   o is_admin: 1 (this grants admin privileges)
6. Click Go to insert the new record.
   🔐 Make sure the password handling in your PHP code does not require hashing (if it does, you’ll need to insert a hashed password using PASSWORD_DEFAULT in PHP).
   Once added, you can log in as the admin user via the login page.

---

💡 Technologies Used
• Frontend: HTML5, CSS3, JavaScript (Vanilla)
• Backend: PHP
• Database: MySQL
• Server: Apache (via XAMPP/WAMP)

---
