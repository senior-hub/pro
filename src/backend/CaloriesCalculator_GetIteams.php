<?php
include '../../config/db.php';
include '../../config/config.php';

try{
$category = $_GET['category'] ?? '';
$search = $_GET['search'] ?? '';

// Start SQL
$sql = "SELECT * FROM calories WHERE 1=1";
$types = "";
$params = [];
$binds = [];

// Dynamically add filters
if (!empty($category)) {
    $sql .= " AND FoodCategory = ?";
    $types .= "s";
    $params[] = $category;
}
if (!empty($search)) {
    $sql .= " AND FoodItem LIKE ?";
    $types .= "s";
    $params[] = "%$search%";
}

$stmt = $db->prepare($sql);

if (!empty($params)) {
    // Create references for bind_param
    foreach ($params as $key => $value) {
        $binds[$key] = &$params[$key];
    }
    array_unshift($binds, $types);
    call_user_func_array([$stmt, 'bind_param'], $binds);
}

$stmt->execute();
$result = $stmt->get_result();
$data = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($data);

$stmt->close();
$db->close();
} catch (mysqli_sql_exception $e) {
    echo json_encode(["error" => "Database error"]);
}
