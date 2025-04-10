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

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];
$is_admin = isset($_SESSION['is_admin']) && $_SESSION['is_admin'];
$action = isset($_POST['action']) ? $_POST['action'] : '';

if ($action == 'add' && !$is_admin) {
    $task = isset($_POST['task']) ? $_POST['task'] : '';
    $sql = "INSERT INTO tasks (user_id, task, status) VALUES (?, ?, 'pending')";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param("is", $user_id, $task);
    if (!$stmt->execute()) {
        echo json_encode(['error' => 'Execute failed: ' . $stmt->error]);
        exit;
    }
    echo json_encode(['success' => true]);
} elseif ($action == 'delete' && !$is_admin) {
    $id = isset($_POST['id']) ? $_POST['id'] : 0;
    $sql = "DELETE FROM tasks WHERE id = ? AND user_id = ?";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param("ii", $id, $user_id);
    if (!$stmt->execute()) {
        echo json_encode(['error' => 'Execute failed: ' . $stmt->error]);
        exit;
    }
    echo json_encode(['success' => true]);
} elseif ($action == 'update' && !$is_admin) {
    $id = isset($_POST['id']) ? $_POST['id'] : 0;
    $task = isset($_POST['task']) ? $_POST['task'] : '';
    $sql = "UPDATE tasks SET task = ? WHERE id = ? AND user_id = ?";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param("sii", $task, $id, $user_id);
    if (!$stmt->execute()) {
        echo json_encode(['error' => 'Execute failed: ' . $stmt->error]);
        exit;
    }
    echo json_encode(['success' => true]);
} elseif ($action == 'updateStatus' && !$is_admin) {
    $id = isset($_POST['id']) ? $_POST['id'] : 0;
    $status = isset($_POST['status']) ? $_POST['status'] : '';
    $sql = "UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param("sii", $status, $id, $user_id);
    if (!$stmt->execute()) {
        echo json_encode(['error' => 'Execute failed: ' . $stmt->error]);
        exit;
    }
    echo json_encode(['success' => true]);
} elseif ($action == 'get') {
    if ($is_admin) {
        // Admin-specific logic will be handled by separate actions
        echo json_encode([]);
    } else {
        $sql = "SELECT * FROM tasks WHERE user_id = ?";
        $stmt = $conn->prepare($sql);
        if ($stmt === false) {
            echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
            exit;
        }
        $stmt->bind_param("i", $user_id);
        if (!$stmt->execute()) {
            echo json_encode(['error' => 'Execute failed: ' . $stmt->error]);
            exit;
        }
        $result = $stmt->get_result();
        $tasks = [];
        while ($row = $result->fetch_assoc()) {
            $tasks[] = $row;
        }
        echo json_encode($tasks);
    }
} elseif ($action == 'get_users' && $is_admin) {
    $sql = "SELECT id, username, email FROM users";
    $result = $conn->query($sql);
    if ($result === false) {
        echo json_encode(['error' => 'Query failed: ' . $conn->error]);
        exit;
    }
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    echo json_encode($users);
} elseif ($action == 'get_user_tasks' && $is_admin) {
    $selected_user_id = isset($_POST['user_id']) ? $_POST['user_id'] : 0;
    $sql = "SELECT * FROM tasks WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param("i", $selected_user_id);
    if (!$stmt->execute()) {
        echo json_encode(['error' => 'Execute failed: ' . $stmt->error]);
        exit;
    }
    $result = $stmt->get_result();
    $tasks = [];
    while ($row = $result->fetch_assoc()) {
        $tasks[] = $row;
    }
    echo json_encode($tasks);
} else {
    echo json_encode(['error' => 'Invalid action or insufficient permissions']);
}

$conn->close();
?>