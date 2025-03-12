<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include '../../config/db.php';
include '../../config/config.php';

// Function to fetch unique values from normal columns
function getUniqueValues($db, $column)
{
    $query = "SELECT DISTINCT `$column` FROM exercises";
    $result = $db->query($query);
    $values = [];
    while ($row = $result->fetch_assoc()) {
        $values[] = $row[$column] !== null ? $row[$column] : "Not Specified";
    }
    return array_values(array_unique($values));
}

// Function to fetch unique values from JSON columns
function getUniqueJsonValues($db, $column)
{
    $query = "
        SELECT DISTINCT JSON_UNQUOTE(JSON_EXTRACT(`$column`, CONCAT('$[', numbers.n, ']'))) AS uniqueValue
        FROM exercises
        JOIN (SELECT 0 AS n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION 
                     SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) AS numbers
        ON JSON_EXTRACT(`$column`, CONCAT('$[', numbers.n, ']')) IS NOT NULL";

    $result = $db->query($query);
    $values = [];
    while ($row = $result->fetch_assoc()) {
        $values[] = $row["uniqueValue"] !== null ? $row["uniqueValue"] : "Not Specified";
    }
    return array_values(array_unique($values));
}

// Fetch unique values for each filter category
$filters = [
    "Force" => getUniqueValues($db, "force"),
    "Level" => getUniqueValues($db, "level"),
    "Mechanic" => getUniqueValues($db, "mechanic"),
    "Equipment" => getUniqueValues($db, "equipment"),
    "Category" => getUniqueValues($db, "category"),
    "Primary Muscles" => getUniqueJsonValues($db, "primaryMuscles"),
    "Secondary Muscles" => getUniqueJsonValues($db, "secondaryMuscles")
];

// Close the database connection
$db->close();

echo json_encode($filters, JSON_PRETTY_PRINT);
