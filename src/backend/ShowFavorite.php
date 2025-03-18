<?php
// ✅ Database Connection
include '../../config/db.php';
include '../../config/config.php';


// ✅ Get user_id from request
$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data["user_id"])) {
    echo json_encode(["success" => false, "message" => "Invalid request parameters."]);
    exit;
}

$user_id = intval($data["user_id"]);
file_put_contents("query_log.txt", "Query user_id: " . print_r($user_id, true) . "\n", FILE_APPEND);

// ✅ Step 1: Fetch `exercise_id`s from `favorites` table
$fav_stmt = $db->prepare("SELECT exercise_id FROM favorites WHERE user_id = ?");
$fav_stmt->bind_param("i", $user_id);
$fav_stmt->execute();
$fav_result = $fav_stmt->get_result();
$exercise_ids = [];

while ($row = $fav_result->fetch_assoc()) {
    $exercise_ids[] = $row["exercise_id"];
}

// ✅ Free result and close statement
$fav_stmt->free_result();
$fav_stmt->close();

// ✅ If no exercises found, return empty response
if (empty($exercise_ids)) {
    echo json_encode(["success" => true, "exercises" => []]);
    exit;
}

// ✅ Step 2: Construct Dynamic Query with `IN` Clause
$placeholders = implode(',', array_fill(0, count($exercise_ids), '?'));
$sql = "SELECT * FROM exercises WHERE id IN ($placeholders)";

// ✅ Step 3: Prepare Statement
$stmt = $db->prepare($sql);
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Database error: " . $db->error]);
    exit;
}

// ✅ Step 4: Bind Parameters Dynamically
$types = str_repeat("s", count($exercise_ids)); // "s" for each string
$stmt->bind_param($types, ...$exercise_ids); // ✅ Pass as strings
$stmt->execute();
$result = $stmt->get_result();





// ✅ Step 5: Fetch All Matching Records
$exercises = $result->fetch_all(MYSQLI_ASSOC);
file_put_contents("query_log.txt", "Query Results: " . print_r($exercises, true) . "\n", FILE_APPEND);

// Decode JSON fields before sending the response
foreach ($exercises as &$exercise) {
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




// ✅ Step 6: Return JSON Response
echo json_encode(["success" => true, "exercises" => $exercises]);



















// ✅ Free result and close statement
$stmt->free_result();
$stmt->close();
