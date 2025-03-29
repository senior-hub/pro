<?php
include '../../config/db.php';
include '../../config/config.php';

$data = json_decode(file_get_contents("php://input"), true);

// Turn off PHP error reporting (For production)
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);
error_log("Debug Log: " . print_r($data, true), 3, "debug_log.txt");


function jsonResponse($success, $message, $data = [])
{
    echo json_encode([
        "success" => $success,
        "message" => $message,
        "data" => $data
    ]);
    exit;
}

// ✅ Validate required data
if (!isset($data["user_id"], $data["id"], $data["action"])) {
    jsonResponse(false, "Invalid request. Missing parameters.");
}

$user_id = intval($data["user_id"]);
$exercise_id = $data["id"];
$action = $data["action"]; // "add" or "remove"

try {
    // ✅ 1. Check if exercise is already in favorites
    $stmt = $db->prepare("SELECT * FROM favorites WHERE user_id = ? AND exercise_id = ?");
    $stmt->execute([$user_id, $exercise_id]);
    $exists = $stmt->fetch();
    $stmt->free_result();
    $stmt->close();
    if ($action === "add") {
        if ($exists) {
            jsonResponse(false, "Exercise already in favorites.");
        } else { // ✅ 2. Insert into favorites if not already added
            $insert_stmt = $db->prepare("INSERT INTO favorites (user_id, exercise_id) VALUES (?, ?)");

            if ($insert_stmt->execute([$user_id, $exercise_id])) {
                $insert_stmt->free_result();
                $insert_stmt->close(); // ✅ Free the statement
                jsonResponse(true, "Exercise added to favorites.");
            } else {

                jsonResponse(false, "Failed to add favorite. Error: " . $errorInfo[2]);
            }
        }
    } elseif ($action === "remove") {
        if ($exists) {
            // ✅ 3. Remove from favorites if exists
            $delete_stmt = $db->prepare("DELETE FROM favorites WHERE user_id = ? AND exercise_id = ?");
            if ($delete_stmt->execute([$user_id, $exercise_id])) {
                $delete_stmt->free_result();
                $delete_stmt->close();
                jsonResponse(true, "Exercise removed from favorites.");
            } else {
                jsonResponse(false, "Failed to remove favorite.");
            }
        } else {
            jsonResponse(false, "Exercise not found in favorites.");
        }
    } else {
        jsonResponse(false, "Invalid action.");
    }
} catch (Exception $e) {
    jsonResponse(false, "Server error: " . $e->getMessage());
}

