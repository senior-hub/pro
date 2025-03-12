<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include '../../config/db.php';   // Database connection
include '../../config/config.php';

try {
    $filters = [
        "Force" => [],
        "Level" => [],
        "Mechanic" => [],
        "Equipment" => [],
        "Category" => [],
        "Primary Muscles" => [],
        "Secondary Muscles" => []
    ];

    // Fetch unique values for each filter column
    foreach ($filters as $key => &$values) {
        $column = strtolower(str_replace(" ", "", $key)); // Match column names in the database
        $sql = "SELECT DISTINCT $column FROM exercises WHERE $column IS NOT NULL";
        $result = $db->query($sql);

        while ($row = $result->fetch_assoc()) {
            if (!empty($row[$column])) {
                $values[] = $row[$column];
            }
        }
    }

    $db->close();

    echo json_encode($filters, JSON_PRETTY_PRINT);
} catch (mysqli_sql_exception $e) {
    error_log("MySQLi Error: " . $e->getMessage());
    echo json_encode(["error" => "Database error occurred"]);
}
