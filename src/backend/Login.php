<?php
session_start();



include '../../config/db.php';   //  database connection
include '../../config/config.php';


try {
    // Get JSON data from React
    $rawData = file_get_contents("php://input");
    file_put_contents("debug_log.txt", "Received Raw Data: " . ($rawData ? $rawData : "EMPTY") . "\n", FILE_APPEND);

    $data = json_decode($rawData, true);
    file_put_contents("debug_log.txt", "Decoded Data: " . print_r($data, true) . "\n", FILE_APPEND);

    // ✅ Ensure JSON is properly decoded
    if (!$data || !isset($data['email']) || !isset($data['password'])) {
        file_put_contents("debug_log.txt", "Error: Missing email or password\n", FILE_APPEND);
        echo json_encode(["success" => false, "message" => "Error: Missing required fields."]);
        exit;
    }

    // Extract and sanitize input
    $email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
    $password = trim($data['password']);

    file_put_contents("debug_log.txt", "Sanitized Email: " . $email . "\n", FILE_APPEND);

    // Prepare SQL statement
    $stmt = $db->prepare("SELECT user_id, email, password_hash, `role` FROM auth WHERE email = ?");
    if (!$stmt) {
        file_put_contents("debug_log.txt", "Database Error: " . $db->error . "\n", FILE_APPEND);
        echo json_encode(["success" => false, "message" => "Database error occurred."]);
        exit;
    }



    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();


    if ($user) {
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['loggedin'] = true;
    } else {
        $_SESSION['loggedin'] = false;
    }





    $stmt->close();

    // ✅ Check if user exists
    if (!$user) {
        file_put_contents("debug_log.txt", "Error: User not found\n", FILE_APPEND);
        echo json_encode(["success" => false, "message" => "Invalid Email or password."]);
        exit;
    }

    file_put_contents("debug_log.txt", "User found: " . print_r($user, true) . "\n", FILE_APPEND);

    // ✅ Verify password
    if (!password_verify($password, $user['password_hash'])) {
        file_put_contents("debug_log.txt", "Error: Password mismatch\n", FILE_APPEND);
        echo json_encode(["success" => false, "message" => "Invalid Email or password."]);
        exit;
    } else {
        file_put_contents("debug_log.txt", "Password verified\n", FILE_APPEND);
    }




    file_put_contents("debug_log.txt", "Login successful for user ID: " . $user['user_id'] . "\n", FILE_APPEND);

    // ✅ Force JSON output and flush
    $response = json_encode(["success" => true, "role" => $user['role'], "userId" => $user['user_id'], "message" => "Login successful"]);
    file_put_contents("debug_log.txt", "Response Sent: " . $response . "\n", FILE_APPEND);



    echo $response;
    flush(); // ✅ Ensure response is sent immediately

} catch (Exception $ex) {
    file_put_contents("debug_log.txt", "Exception: " . $ex->getMessage() . "\n", FILE_APPEND);
    echo json_encode(["success" => false, "message" => "Error: " . $ex->getMessage()]);
}

$db->close();
exit;
