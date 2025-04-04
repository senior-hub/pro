<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
include '../../config/db.php';
include '../../config/config.php';
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    
$data = json_decode(file_get_contents("php://input"), true);
$foodItem = $data['foodItem'] ?? '';
$grams = floatval($data['grams'] ?? 0);



if (!$foodItem || $grams <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

$stmt = $db->prepare("SELECT Cals_per100grams FROM calories WHERE FoodItem = ? LIMIT 1");
$stmt->bind_param("s", $foodItem);
$stmt->execute();
$result = $stmt->get_result();
$data = $result->fetch_assoc();


if (!$data) {
    http_response_code(404);
    echo json_encode(['error' => 'Food item not found']);
    exit;
}

$caloriesPer100g = isset($data['Cals_per100grams']) ? floatval($data['Cals_per100grams']) : 0;
$totalCalories = ($grams / 100) * $caloriesPer100g;

echo json_encode([
    'item' => $foodItem,
    'quantity' => $grams,
    'calories' => round($totalCalories, 2)
]);

    $stmt->close();
    $db->close();
} catch (mysqli_sql_exception $e) {
    echo json_encode(["error" => "Database error"]);
}
