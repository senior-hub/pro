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

// Check if user is logged in
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    echo json_encode(["error" => "Unauthorized - Please log in"]);
    exit;
}

$user_id = $_SESSION['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(["error" => "User ID missing from session"]);
    exit;
}

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
echo json_encode(["messages" => $messages]);
