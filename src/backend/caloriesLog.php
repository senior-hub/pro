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
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
   

    
    $user_id = $db->real_escape_string($input['user_id']);
    $food_item = $db->real_escape_string($input['food_item']);
    $amount_grams = floatval($input['amount_grams']);
    $cals = floatval($input['cals']);
    $kj = floatval($input['kj']);
    $log_date = date('Y-m-d');
    
    // 2. Insert into calorie_log_items
    $insert = "
        INSERT INTO calorie_log_items (user_id, log_date, food_item, amount_grams, cals, kj)
        VALUES ('$user_id', '$log_date', '$food_item', '$amount_grams', '$cals', '$kj')
    ";
    
    if ($db->query($insert)) {
        echo json_encode(['message' => 'Calories logged successfully']);
    } else {
        echo json_encode(['message' => 'Insert failed', 'error' => $db->error]);
    }
    
    
} catch (mysqli_sql_exception $e) {
    echo json_encode(['message' => 'Database error', 'error' => $e->getMessage()]);
}
