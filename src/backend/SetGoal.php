<?php
header('Access-Control-Allow-Origin: http://localhost:3000'); // Adjust this if your frontend URL is different
header('Access-Control-Allow-Methods: GET, POST'); // Allowable methods
header('Access-Control-Allow-Headers: Content-Type'); // Needed for POST requests that have body data
header('Access-Control-Allow-Credentials: true'); // If you are dealing with cookies
header('Content-Type: application/json');

include '../../config/db.php'; // Ensure this path is correct

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
