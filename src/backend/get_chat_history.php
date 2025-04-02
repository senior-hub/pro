<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/config.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Debugging
file_put_contents("auth_debug.txt", "Session data: " . print_r($_SESSION, true) . "\n", FILE_APPEND);
file_put_contents("auth_debug.txt", "Cookie data: " . print_r($_COOKIE, true) . "\n", FILE_APPEND);

// Check user authentication from both session and cookies
$is_logged_in = isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true;
$user_id = $_SESSION['user_id'] ?? null;

// If session authentication fails, check cookies
if (!$is_logged_in || !$user_id) {
    // Check for authentication cookie
    if (isset($_COOKIE['userId']) && isset($_COOKIE['loggedIn']) && $_COOKIE['loggedIn'] === 'true') {
        $user_id = $_COOKIE['userId'];
        $is_logged_in = true;
        
        // Optionally restore session from cookies
        $_SESSION['user_id'] = $user_id;
        $_SESSION['loggedin'] = true;
        
        file_put_contents("auth_debug.txt", "Authentication restored from cookies. User ID: $user_id\n", FILE_APPEND);
    }
}

// Final authentication check
if (!$is_logged_in || !$user_id) {
    file_put_contents("auth_debug.txt", "Authentication failed. No valid session or cookie.\n", FILE_APPEND);
    echo json_encode(["error" => "Unauthorized - Please log in"]);
    exit;
}

// Make sure user_id is properly sanitized as integer
$user_id = intval($user_id);

// ✅ Fetch all messages for this user from `chatbot` table
$stmt = $db->prepare("SELECT role, message, created_at FROM chatbot WHERE user_id = ? ORDER BY created_at ASC");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$messages = [];
while ($row = $result->fetch_assoc()) {
    $messages[] = $row;
}

$stmt->close();

file_put_contents("auth_debug.txt", "Retrieved " . count($messages) . " messages for user ID: $user_id\n", FILE_APPEND);
echo json_encode(["messages" => $messages]);
