<?php

// Ensure required extensions are loaded
if (!extension_loaded('json')) {
    die('JSON extension is not loaded.');
}
if (!extension_loaded('mysqli')) {
    die('MySQLi extension is not loaded.');
}
if (!extension_loaded('openssl')) {
    die('OpenSSL extension is not loaded.');
}

// Add session_start for consistent session handling with Login.php
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include '../../config/db.php';   //  database connection
include '../../config/config.php';

// Read the raw POST data
$data = file_get_contents("php://input");
$decodedData = json_decode($data, true);

// Extract fields
$name = isset($decodedData["name"]) ? $decodedData["name"] : "Guest";
$email = isset($decodedData["email"]) ? $decodedData["email"] : "No email provided";
$password = isset($decodedData["password"]) ? $decodedData["password"] : "No password provided";

// Log received data for debugging
file_put_contents("signup_debug.txt", "Received data: " . print_r($decodedData, true), FILE_APPEND);

// Ensure database connection is working
if (!isset($db)) {
    $response = ["success" => false, "message" => "Database connection failed. Check db.php."];
    file_put_contents("debug_response.json", json_encode($response)); // Save JSON to file
    echo json_encode($response);
    exit;
}

$checkEmailQuery = $db->prepare("SELECT user_id FROM auth WHERE email = ?");
$checkEmailQuery->bind_param("s", $email);
$checkEmailQuery->execute();
$checkEmailQuery->store_result();

if ($checkEmailQuery->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email already exists. Please use another email."]);
    exit;
}

$checkEmailQuery->close();

// Insert user into `auth` table
$created_at = date("Y-m-d H:i:s");
$password_hash = password_hash($password, PASSWORD_DEFAULT);

$insert_query = $db->prepare("INSERT INTO auth (email, password_hash, name, role, created_at) VALUES (?, ?, ?, ?, ?)");
$test_role = "user"; // Default role

$insert_query->bind_param("sssss", $email, $password_hash, $name, $test_role, $created_at);
if ($insert_query->execute()) {

    // Prepare to fetch the user details after insertion
    $stmt = $db->prepare("SELECT user_id, email, password_hash, `role` FROM auth WHERE email = ?");

    if ($stmt) {
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();

        if ($user) {
            // Set session variables like in Login.php
            session_regenerate_id(true);
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['loggedin'] = true;

            $response = [
                "success" => true,
                "message" => "User inserted and login successful",
                "role" => $user['role'],
                "userId" => $user['user_id']
            ];
        } else {
            $_SESSION['loggedin'] = false;
            $response = [
                "success" => false,
                "message" => "User inserted but retrieval failed"
            ];
        }
    } else {
        $response = [
            "success" => false,
            "message" => "Database query preparation failed"
        ];
    }
} else {
    $response = [
        "success" => false,
        "message" => "User insertion failed"
    ];
}

// Save the response to a debug file
file_put_contents("debug_response.json", json_encode($response));

// Send the final JSON response
echo json_encode($response);

$insert_query->close();
$db->close();
