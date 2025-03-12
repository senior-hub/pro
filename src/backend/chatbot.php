<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/handlers/ChatbotHandler.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use GuzzleHttp\Client;

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    echo json_encode(["error" => "Unauthorized - Please log in"]);
    exit;
}

$user_id = $_SESSION['user_id'] ?? null;
if (!$user_id) {
    echo json_encode(["error" => "User ID missing"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$userMessage = trim($data['message'] ?? '');

if (!$userMessage) {
    echo json_encode(["error" => "Message required"]);
    exit;
}

// 🔥 Always log the user message into `chatbot` table
storeMessage($db, $user_id, 'user', $userMessage);

$handler = new ChatbotHandler($db, $user_id);

$systemPrompt = "
You are a fitness assistant. Analyze the user's message and detect the intent.
Return JSON with this exact structure:

{
    \"intent\": \"add_goal\" | \"get_goals\" | \"fetch_available_goals\" | \"general_chat\",
    \"goals\": [\"goal1\", \"goal2\"] // only if intent involves goals
}

Example:
- 'What goals can I set?' -> {\"intent\": \"fetch_available_goals\", \"goals\": []}
- 'Add flexibility' -> {\"intent\": \"add_goal\", \"goals\": [\"flexibility\"]}
- 'Show my goals' -> {\"intent\": \"get_goals\", \"goals\": []}
- 'What is a burpee?' -> {\"intent\": \"general_chat\", \"goals\": []}
";

$client = new Client();
$response = $client->post('https://api.openai.com/v1/chat/completions', [
    'headers' => [
        'Authorization' => "Bearer " . $_ENV['OPENAI_API_KEY'],
        'Content-Type' => 'application/json',
    ],
    'json' => [
        'model' => 'gpt-4',
        'messages' => [
            ['role' => 'system', 'content' => $systemPrompt],
            ['role' => 'user', 'content' => $userMessage]
        ]
    ]
]);

$apiResponse = json_decode($response->getBody(), true);
$parsedIntent = json_decode($apiResponse['choices'][0]['message']['content'] ?? '{}', true);

$intent = $parsedIntent['intent'] ?? 'general_chat';
$goals = $parsedIntent['goals'] ?? [];

ob_start(); // Buffer the handler response

switch ($intent) {
    case 'fetch_available_goals':
        $handler->fetchAvailableGoals();
        break;

    case 'get_goals':
        $handler->getGoals();
        break;

    case 'add_goal':
        $handler->addGoalsFromArray($goals);
        break;

    case 'general_chat':
    default:
        $handler->chatWithGPT($userMessage);
        break;
}

$responseJson = ob_get_clean();
$responseArray = json_decode($responseJson, true);
$botMessage = $responseArray['message'] ?? 'No response.';

// 🔥 Always log the bot response into `chatbot` table
storeMessage($db, $user_id, 'bot', $botMessage);

// Finally send the response back to React
echo json_encode(["message" => $botMessage]);

function storeMessage($db, $user_id, $role, $message) {
    $stmt = $db->prepare("INSERT INTO chatbot (user_id, role, message) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $user_id, $role, $message);
    $stmt->execute();
    $stmt->close();
}
