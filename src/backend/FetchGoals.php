<?php

include '../../config/db.php'; 
include '../../config/config.php';

header("Access-Control-Allow-Origin: http://localhost:3000");  // 🔥 Set explicit allowed origin
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");  // 🔥 Allow credentials
if ($db instanceof mysqli) {
    $result = $db->query("SELECT id, goal_name FROM `fitness_goals`");

    $goals = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $goals[] = $row;
        }
        echo json_encode($goals);
    } else {
        echo json_encode(["error" => "Error in query: " . $db->error]);
    }
} else {
    echo json_encode(["error" => "Database connection failed"]);
}



// Now you have the IDs stored in $selectedOptions
// Process them as needed

exit;
