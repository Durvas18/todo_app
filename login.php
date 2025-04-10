<?php
session_start();
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "todo_list";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $sql = "SELECT id, username, password FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($user = $result->fetch_assoc()) {
        // Debug information
        $debug = [
            'entered_password' => $password,
            'stored_password' => $user['password'],
            'match' => ($password === $user['password'])
        ];
        if ($password === $user['password']) { // Plain text comparison
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['is_admin'] = ($username === 'admin');
            echo json_encode(['success' => true, 'is_admin' => $_SESSION['is_admin'], 'debug' => $debug]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Invalid password', 'debug' => $debug]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'User not found']);
    }
    $stmt->close();
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
$conn->close();
?>