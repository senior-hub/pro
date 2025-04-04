<?php
include '../../config/db.php';
include '../../config/config.php';

try {
    $stmt = $db->query("SELECT DISTINCT FoodCategory FROM calories ORDER BY FoodCategory");
    $categories = $stmt->fetch_all(MYSQLI_ASSOC);

echo json_encode($categories);
    $stmt->close();
    $db->close();
} catch (mysqli_sql_exception $e) {
    echo json_encode(["error" => "Database error"]);
}
