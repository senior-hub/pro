<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include '../../config/db.php';
include '../../config/config.php';

try {
    // Get JSON request
    $inputJSON = file_get_contents("php://input");
    $input = json_decode($inputJSON, true);

    // Extract search term & filters
    $query = isset($input['query']) ? trim($input['query']) : '';
    $filters = isset($input['filters']) ? $input['filters'] : [];

    // Base SQL query
    $sql = "SELECT * FROM exercises WHERE 1";
    $params = [];
    $types = '';

    // If search term is provided, add condition
    if (!empty($query)) {
        $sql .= " AND name LIKE ?";
        $params[] = "%" . $query . "%";
        $types .= "s";
    }

    // Apply selected filters dynamically
    foreach ($filters as $column => $values) {

        if (!empty($values)) {
            // ✅ Map JSON column names to database column names
            if ($column === "Primary Muscles") {
                $column = "primaryMuscles"; // Fix column name
            } elseif ($column === "Secondary Muscles") {
                $column = "secondaryMuscles"; // Fix column name
            }

            if ($column === "primaryMuscles" || $column === "secondaryMuscles") {
                // ✅ Correct JSON Filtering for multiple selections
                $jsonConditions = [];
                foreach ($values as $value) {
                    $jsonConditions[] = "JSON_SEARCH(`$column`, 'one', ?) IS NOT NULL";
                    $params[] = $value;  // No need for json_encode()
                    $types .= "s";
                }
                $sql .= " AND (" . implode(" OR ", $jsonConditions) . ")";
            } else {
                // Normal columns (including `force`, `level`, `equipment`)
                $column = ($column === "force") ? "`force`" : "`$column`"; // Use backticks for reserved words
                $placeholders = implode(',', array_fill(0, count($values), '?'));
                $sql .= " AND $column IN ($placeholders)";
                $params = array_merge($params, $values);
                $types .= str_repeat("s", count($values));
            }
        }
    }

    // Prepare and execute SQL statement
    $stmt = $db->prepare($sql);
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();

    // Fetch results
    $result = $stmt->get_result();
    $exercises = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];

    // Close statement
    $stmt->close();
    $db->close();

    // Decode JSON fields before sending the response
    foreach ($exercises as &$exercise) {
        if (!empty($exercise['primaryMuscles'])) {
            $exercise['primaryMuscles'] = json_decode($exercise['primaryMuscles'], true);
        }
        if (!empty($exercise['secondaryMuscles'])) {
            $exercise['secondaryMuscles'] = json_decode($exercise['secondaryMuscles'], true);
        }
        if (!empty($exercise['Instructions'])) {
            $exercise['Instructions'] = json_decode($exercise['Instructions'], true);
        }
        if (!empty($exercise['images'])) {
            $exercise['images'] = json_decode($exercise['images'], true);
        }
    }

    // Return JSON response
    echo json_encode($exercises, JSON_PRETTY_PRINT);
} catch (mysqli_sql_exception $e) {
    error_log("MySQLi Error: " . $e->getMessage());
    echo json_encode(["error" => "Database error occurred"]);
}
