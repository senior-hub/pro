<<<<<<< HEAD
<?php


include '../../config/db.php';   //  database connection
include '../../config/config.php';

try {

    // Get the raw POST data and decode it
    $inputJSON = file_get_contents("php://input");
    $input = json_decode($inputJSON, true);

    // Extract search term
    $query = isset($input['name']) ? trim($input['name']) : '';


    if (!empty($query)) {

        // Prepare SQL statement
        $sql = "SELECT * FROM exercises WHERE name LIKE ?";
        $stmt = $db->prepare($sql);
        $query_param = "%$query%";
        $stmt->bind_param("s", $query_param);
        $stmt->execute();

        // Fetch results
        $result = $stmt->get_result();
        $results = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];

        // Close statement
        $stmt->close();
        $db->close();

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
} catch (mysqli_sql_exception $e) {
    error_log("MySQLi Error: " . $e->getMessage());
    echo json_encode(["error" => "Database error occurred"]);
}
=======
<?php


include '../../config/db.php';   //  database connection
include '../../config/config.php';

try {

    // Get the raw POST data and decode it
    $inputJSON = file_get_contents("php://input");
    $input = json_decode($inputJSON, true);

    // Extract search term
    $query = isset($input['name']) ? trim($input['name']) : '';


    if (!empty($query)) {

        // Prepare SQL statement
        $sql = "SELECT * FROM exercises WHERE name LIKE ?";
        $stmt = $db->prepare($sql);
        $query_param = "%$query%";
        $stmt->bind_param("s", $query_param);
        $stmt->execute();

        // Fetch results
        $result = $stmt->get_result();
        $results = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];

        // Close statement
        $stmt->close();
        $db->close();

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
} catch (mysqli_sql_exception $e) {
    error_log("MySQLi Error: " . $e->getMessage());
    echo json_encode(["error" => "Database error occurred"]);
}
>>>>>>> copy-enhanced-ui-chatbot-changes
