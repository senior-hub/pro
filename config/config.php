<?php

// Set headers
header('Content-Type: application/json; charset=UTF-8'); // Set content type to JSON and character set to UTF-8
header('Access-Control-Allow-Origin: *'); // Allow any domain to access this API
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS'); // Allow specific HTTP methods
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Allow certain headers

// Set internal character encoding to UTF-8
mb_internal_encoding("UTF-8");

// Start session if it has not already been started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Set default timezone (modify as needed)
date_default_timezone_set('UTC');

// Error reporting level
error_reporting(E_ALL); // Report all errors and warnings
ini_set('display_errors', '1'); // Display errors in output (set to '0' in production)

// Load environment variables from .env file
require_once __DIR__ . '/../vendor/autoload.php';
// Ensure Composer is installed and used
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// OpenAI API Key (Loaded securely from .env file)
$openai_api_key = $_ENV['OPENAI_API_KEY'] ?? null;

if (!$openai_api_key) {
    die(json_encode(["error" => "OpenAI API key is missing. Please set it in .env"]));
}

// Include database configuration if needed
// require_once 'db.php'; // Uncomment if you have a separate db.php for database connections

// Any other global initialization can go here
?>
