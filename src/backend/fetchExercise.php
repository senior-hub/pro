<?php

include '../../config/db.php';
include '../../config/config.php';


if (!isset($_GET['id'])) {
    echo json_encode(["success" => false, "message" => "No exercise ID provided"]);
    exit();
}

$id = $_GET['id'];

$sql = "SELECT * FROM exercises WHERE id = ?";
$stmt = $db->prepare($sql);
$stmt->bind_param("s", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $exercise = $result->fetch_assoc();

    // Decode JSON fields before sending the response
    if (!empty($exercise['primaryMuscles'])) {
        $exercise['primaryMuscles'] = json_decode($exercise['primaryMuscles'], true);
    }
    if (!empty($exercise['instructions'])) {
        $exercise['instructions'] = json_decode($exercise['instructions'], true);
    }
    if (!empty($exercise['secondaryMuscles'])) {
        $exercise['secondaryMuscles'] = json_decode($exercise['secondaryMuscles'], true);
    }
    if (!empty($exercise['images'])) {
        $exercise['images'] = json_decode($exercise['images'], true);
    }

    echo json_encode(["success" => true, "details" => $exercise]);
} else {
    echo json_encode(["success" => false, "message" => "Exercise not found"]);
}



$stmt->close();
$db->close();
