<?php
include '../../config/db.php';
include '../../config/config.php';
header('Content-Type: application/json');

try {
    $query = isset($_GET['query']) ? $_GET['query'] : '';
    if (!empty($query)) {
        $sql = "SELECT * FROM food WHERE category LIKE ?";
        $stmt = $db->prepare($sql);
        $like = '%' . $query . '%';
        $stmt->bind_param("s", $like);
    } else {
        $sql = "SELECT * FROM food";
        $stmt = $db->prepare($sql);
    }

    $stmt->execute();
    $result = $stmt->get_result();
    $foods = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode( $foods);
    $stmt->close();
    $db->close();
} catch (mysqli_sql_exception $e) {
    echo json_encode(["error" => "Database error"]);
}
