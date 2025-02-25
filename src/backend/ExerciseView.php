<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fitness";

try {
    // Connect to the database
    $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get the raw POST data and decode it
    $inputJSON = file_get_contents("php://input");
    $input = json_decode($inputJSON, true);

    // Extract search term
    $query = isset($input['name']) ? trim($input['name']) : '';

    if (!empty($query)) {
        // Prepare SQL statement
        $sql = "SELECT * FROM exercises WHERE name LIKE :query";
        $stmt = $conn->prepare($sql);
        $stmt->execute(['query' => "%$query%"]);

        // Fetch results
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Decode JSON fields before sending the response
        foreach ($results as &$exercise) {
            if (!empty($exercise['primaryMuscles'])) {
                $exercise['primaryMuscles'] = json_decode($exercise['primaryMuscles'], true);
            }
            if (!empty($exercise['Instructions'])) {
                $exercise['Instructions'] = json_decode($exercise['Instructions'], true);
            }

            if (!empty($exercise['secondaryMuscles'])) {
                $exercise['secondaryMuscles'] = json_decode($exercise['secondaryMuscles'], true);
            }
            if (!empty($exercise['images'])) {
                $exercise['images'] = json_decode($exercise['images'], true);
            }
        }

        echo json_encode($results, JSON_PRETTY_PRINT);
    } else {
        echo json_encode([]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
