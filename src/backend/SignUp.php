<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include '../../config/db.php';   //  database connection

// Read the raw POST data
$data = file_get_contents("php://input");
$decodedData = json_decode($data, true);

// Extract fields
$name = isset($decodedData["name"]) ? $decodedData["name"] : "Guest";
$email = isset($decodedData["email"]) ? $decodedData["email"] : "No email provided";
$password = isset($decodedData["password"]) ? $decodedData["password"] : "No password provided";



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
    $response = ["success" => true, "message" => "User inserted successfully"];
    echo json_encode($response);
    file_put_contents("debug_response.json", json_encode($response)); // Save JSON to file

} else {
    $response = ["success" => false, "message" => "Insertion failed: " . $insert_query->error];
    echo json_encode($response);
    file_put_contents("debug_response.json", json_encode($response)); // Save JSON to file

}


$insert_query->close();
$db->close();


?>


