<?php
// File: check_session.php


header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');

$response = [
    'isLoggedIn' => $_SESSION['loggedin'] ?? false,
    'user_id' => $_SESSION['user_id'] ?? null
];

echo json_encode($response);
