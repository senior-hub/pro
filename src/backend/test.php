<?php
// test.php

include '../../config/db.php';    // Ensure this path is correct
include '../../config/config.php';

ini_set('display_errors', 1);
error_reporting(E_ALL);

$logFile = 'log.txt';
$finalResponse = []; // Store the final response here

// Read the raw JSON POST data
$rawData = file_get_contents("php://input");
// Log raw data for debugging
file_put_contents($logFile, "Raw data: " . $rawData . "\n", FILE_APPEND);

if (!$rawData) {
    file_put_contents($logFile, "No raw data received.\n", FILE_APPEND);
    $finalResponse = ["success" => false, "message" => "No raw data received"];
    echo json_encode($finalResponse);
    exit;
}

// Decode the JSON data into an associative array
$data = json_decode($rawData, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    $jsonError = json_last_error_msg();
    file_put_contents($logFile, "JSON Decode Error: $jsonError\nRaw Data: $rawData\n", FILE_APPEND);
    $finalResponse = ["success" => false, "message" => "Invalid JSON: $jsonError"];
    echo json_encode($finalResponse);
    exit;
}

// Extract requestData
$requestData = isset($data['requestData']) ? $data['requestData'] : [];
$selectedGoalIds = isset($requestData['selectedGoalIds']) ? $requestData['selectedGoalIds'] : [];
$userId = isset($requestData['userId']) ? $requestData['userId'] : null;

// Log decoded values
$logEntry = "Decoded Data:\nUser ID: " . $userId . "\nSelected Goal IDs: " . print_r($selectedGoalIds, true) . "\n";
file_put_contents($logFile, $logEntry, FILE_APPEND);

if (!$userId) {
    $finalResponse = ["success" => false, "message" => "User ID is missing"];
    echo json_encode($finalResponse);
    exit;
}

// STEP 1: Delete existing records for this user
$stmt = $db->prepare("SELECT * FROM user_fitness_goals WHERE user_id = ?");
if (!$stmt) {
    $errMsg = "Prepare failed: " . $db->error;
    file_put_contents($logFile, $errMsg . "\n", FILE_APPEND);
    $finalResponse = ["success" => false, "message" => $errMsg];
    echo json_encode($finalResponse);
    exit;
}

$stmt->bind_param("s", $userId);
$stmt->execute();
$result = $stmt->get_result();
$numRows = $result->num_rows;
file_put_contents($logFile, "User $userId: Found $numRows record(s).\n", FILE_APPEND);

if ($numRows > 0) {
    $deleteStmt = $db->prepare("DELETE FROM user_fitness_goals WHERE user_id = ?");
    if (!$deleteStmt) {
        $errMsg = "Delete prepare failed: " . $db->error;
        file_put_contents($logFile, $errMsg . "\n", FILE_APPEND);
        $finalResponse = ["success" => false, "message" => $errMsg];
        echo json_encode($finalResponse);
        exit;
    }
    $deleteStmt->bind_param("s", $userId);
    $deleteStmt->execute();
    $deletedRows = $deleteStmt->affected_rows;
    file_put_contents($logFile, "User $userId: Deleted $deletedRows record(s).\n", FILE_APPEND);
}

// STEP 2: Insert new records with STRING goal IDs
$insertQuery = "INSERT INTO user_fitness_goals (user_id, fitness_goal_id) VALUES (?, ?)";
$insertStmt = $db->prepare($insertQuery);
if (!$insertStmt) {
    $errMsg = "Insert prepare failed: " . $db->error;
    file_put_contents($logFile, $errMsg . "\n", FILE_APPEND);
    $finalResponse = ["success" => false, "message" => $errMsg];
    echo json_encode($finalResponse);
    exit;
}

foreach ($selectedGoalIds as $goalId) {
    $goalIdStr = strval($goalId); // Ensure it is a string
    $insertStmt->bind_param("ss", $userId, $goalIdStr);
    $insertStmt->execute();
    file_put_contents($logFile, "Inserted record: user_id = $userId, fitness_goal_id = $goalIdStr\n", FILE_APPEND);
}

$finalResponse = ['success' => true, 'message' => 'Operation completed'];
echo json_encode($finalResponse);

// Clean up
$stmt->close();
if (isset($deleteStmt)) {
    $deleteStmt->close();
}
$insertStmt->close();
$db->close();
