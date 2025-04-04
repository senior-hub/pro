<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ This is critical:
$user_id = $_GET['user_id'] ?? '';

file_put_contents("debug_log.txt", "Fetched user_id: " . $user_id . "\n", FILE_APPEND);

if (empty($user_id)) {
    http_response_code(400);
    echo json_encode(['message' => 'User ID is required']);
    exit;
}

// Continue with DB logic here...
include '../../config/db.php';

// Get log date (today's date)
$log_date = date('Y-m-d');

$stmt = "SELECT * FROM calorie_log_items WHERE user_id = '$user_id' AND log_date = '$log_date'";
$result = $db->query($stmt);

if (!$result) {
    echo json_encode(['message' => 'Query failed', 'error' => $db->error]);
    exit;
}

if ($result->num_rows === 0) {
    echo json_encode([]);
    exit;
}

$CaloriesLog = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($CaloriesLog);
$db->close();
?>