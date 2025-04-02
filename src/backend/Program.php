<<<<<<< HEAD
<?php

include '../../config/db.php';    // Ensure this path is correct
include '../../config/config.php';
header("Content-Type: application/json");

// Get JSON data from React
$rawData = file_get_contents("php://input");
file_put_contents("debug_log.txt", "Received Raw Data: " . ($rawData ? $rawData : "EMPTY") . "\n", FILE_APPEND);

$data = json_decode($rawData, true);
file_put_contents("debug_log.txt", "Decoded Data: " . print_r($data, true) . "\n", FILE_APPEND);

// Check if 'program_name' exists in the received JSON data
if (isset($data['program_name'])) {
    $program_name = $data['program_name']; // Extract program_name

    // Prepare SQL statement
    $stmt = $db->prepare("SELECT * FROM fitprogram WHERE program_name = ?");
    if (!$stmt) {
        file_put_contents("debug_log.txt", "Database Error: " . $db->error . "\n", FILE_APPEND);
        echo json_encode(["success" => false, "message" => "Database error occurred."]);
        exit;
    }

    $stmt->bind_param("s", $program_name);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $program = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode(["success" => true, "data" => $program]);
    } else {
        echo json_encode(["success" => false, "message" => "No record found"]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "error" => "Program name not provided"]);
}

// Close database connection
$db->close();
=======
<?php

include '../../config/db.php';    // Ensure this path is correct
include '../../config/config.php';
header("Content-Type: application/json");

// Get JSON data from React
$rawData = file_get_contents("php://input");
file_put_contents("debug_log.txt", "Received Raw Data: " . ($rawData ? $rawData : "EMPTY") . "\n", FILE_APPEND);

$data = json_decode($rawData, true);
file_put_contents("debug_log.txt", "Decoded Data: " . print_r($data, true) . "\n", FILE_APPEND);

// Check if 'program_name' exists in the received JSON data
if (isset($data['program_name'])) {
    $program_name = $data['program_name']; // Extract program_name

    // Prepare SQL statement
    $stmt = $db->prepare("SELECT * FROM fitprogram WHERE program_name = ?");
    if (!$stmt) {
        file_put_contents("debug_log.txt", "Database Error: " . $db->error . "\n", FILE_APPEND);
        echo json_encode(["success" => false, "message" => "Database error occurred."]);
        exit;
    }

    $stmt->bind_param("s", $program_name);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $program = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode(["success" => true, "data" => $program]);
    } else {
        echo json_encode(["success" => false, "message" => "No record found"]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "error" => "Program name not provided"]);
}

// Close database connection
$db->close();
>>>>>>> copy-enhanced-ui-chatbot-changes
