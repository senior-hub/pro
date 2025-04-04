<?php

// CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
include '../../config/db.php';
include '../../config/config.php';



try {
    
    include '../../config/db.php'; // Adjust if needed

    $user_id = $_GET['user_id'] ?? '';
    
    // Optional log for debugging
    file_put_contents("debug_log.txt", "GET: " . json_encode($_GET) . "\n", FILE_APPEND);
    
    if (empty($user_id)) {
        http_response_code(400);
        echo json_encode(['message' => 'Missing or invalid user_id']);
        exit();
    }
    
    // 🔥 Now it's safe to escape it
    $user_id = $db->real_escape_string($user_id);
    $log_date = date('Y-m-d');
    
    // 2. Insert into calorie_log_items
    $delete = " DELETE FROM `calorie_log_items` WHERE `user_id`='$user_id'  AND `log_date` ='$log_date' ";
    
    if ($db->query($delete)) {
        echo json_encode(['message' => 'Calories deleted successfully']);
    } else {
        echo json_encode(['message' => 'Insert failed', 'error' => $db->error]);
    }
    
    
} catch (mysqli_sql_exception $e) {
    echo json_encode(['message' => 'Database error', 'error' => $e->getMessage()]);
}
