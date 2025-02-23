<?php
session_start();
header("Content-Type: application/json");

// Destroy session and remove all session variables
session_unset();
session_destroy();

// Return success response
echo json_encode(["success" => true, "message" => "Logged out successfully."]);
exit;
