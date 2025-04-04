<?php




// Database connection
include '../../config/db.php';
include '../../config/config.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !is_array($data)) {
    echo json_encode(["success" => false, "message" => "Invalid or missing JSON input."]);
    exit;
}

try {
 
    
    
    
    $date_of_birth = trim($data['dateOfBirth']);
    $gender = trim($data['gender']);
    $weight = floatval($data['weight']);


    $height = floatval($data['height']);
    $activity_level = trim($data['activityLevel']);
    $user_id =  trim($data['userId']);

    $BMI = $weight / (($height / 100) ** 2);

    $updated_at = date("Y-m-d H:i:s");

    $stmt = $db->prepare("
    INSERT INTO users (
        user_id, date_of_birth, gender, weight, height, activity_level, updated_at, BMI
    ) VALUES (
        ?, ?, ?, ?, ?, ?, NOW(), ?
    )
    ON DUPLICATE KEY UPDATE
        date_of_birth = VALUES(date_of_birth),
        gender = VALUES(gender),
        weight = VALUES(weight),
        height = VALUES(height),
        activity_level = VALUES(activity_level),
        updated_at = NOW(),
        BMI = VALUES(BMI)
");

$stmt->execute([
    $user_id,
    $date_of_birth,
    $gender,
    $weight,
    $height,
    $activity_level,
    $BMI
]);

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
