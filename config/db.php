<?php

// Database credentials
$host = "localhost";  
$username = "root";   
$password = "";       
$dbname = "fitness";  


// Create a connection
$db = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($db->connect_error) {
    die(json_encode(["success" => false, "message" => "❌ Connection failed: " . $db->connect_error]));
}

