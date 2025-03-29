<?php
// File: check_session.php


header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow only requests from this origin
header("Access-Control-Allow-Credentials: true"); // Allows cookies and sessions to be included
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Specifies methods allowed when accessing the resource
header("Content-Type: application/json"); // Optional: Specify the format of data in the response

session_start();
header('Content-Type: application/json');

$response = [
    'isLoggedIn' => $_SESSION['loggedin'] ?? false,
    'user_id' => $_SESSION['user_id'] ?? null
];

echo json_encode($response);
