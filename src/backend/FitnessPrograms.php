<?php

include '../../config/db.php';   //  database connection
include '../../config/config.php';

try {


    // Prepare SQL statement
    $sql = "SELECT DISTINCT `level`, program_name  FROM fitProgram";
    $stmt = $db->prepare($sql);
    $stmt->execute();


    // Fetch results
    $result = $stmt->get_result();
    $results = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];

    // Close statement
    $stmt->close();
    $db->close();
    
    // Decode JSON fields before sending the response
    echo json_encode($results, JSON_PRETTY_PRINT);


} catch (mysqli_sql_exception $e) {
    error_log("MySQLi Error: " . $e->getMessage());
    echo json_encode(["error" => "Database error occurred"]);
}
