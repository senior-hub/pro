<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

error_reporting(E_ALL);
ini_set('display_errors', 0);

// Database connection
include '../../config/db.php';
include '../../config/config.php';

try {

    $rawData = file_get_contents("php://input");
    $data = json_decode($rawData, true);

    // Log received data
    file_put_contents("debug_log.txt", "Received Data: " . print_r($data, true) . "\n", FILE_APPEND);

    if (!$data || !isset($data['user_id'], $data['gender'], $data['weight'], $data['height'], $data['activityLevel'])) {
        echo json_encode(["success" => false, "message" => "Error: Missing required fields."]);
        exit;
    }

    $date_of_birth = trim($data['dateOfBirth']);
    $gender = trim($data['gender']);
    $weight = floatval($data['weight']);
    $BMI = floatval($data['BMI']);

    $height = floatval($data['height']);
    $activity_level = trim($data['activityLevel']);
    $user_id =  trim($data['userId']);


    $updated_at = date("Y-m-d H:i:s");

   
$stmt = $pdo->prepare("
UPDATE users
SET 
    date_of_birth = ?,
    gender = ?,
    weight = ?,
    height = ?,
    activity_level = ?,
    updated_at = NOW(),
    BMI = ?
WHERE user_id = ?
");


    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "Prepare failed: " . $db->error]);
        exit;
    }


// Bind parameters in the correct order
            $stmt->execute([
            $date_of_birth,    
            $gender,           
            $weight,           
            $height,          
            $activity_level,   
            $bmi,              
            $user_id           
            ]);    
            
    $stmt->execute();
    // Execute the statement and handle the response

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Profile updated successfully!"]);
    } else {
        echo json_encode(["success" => false, "message" => "No changes were made to the profile."]);
    }
    $stmt->close();

    $db->close();
} catch (Exception $ex) {
    echo json_encode(["success" => false, "message" => "Error: " . $ex->getMessage()]);
}
exit;
