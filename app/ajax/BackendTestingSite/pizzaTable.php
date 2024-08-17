<?php

// include the DB connect file. ../ because its outside of this folder
include '../connectDB.php';

$sql = "SELECT *
        FROM products p";

$result = $conn->query($sql);

$data = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
} else {
    $data[] = "0 results";
}
$conn->close();

echo json_encode($data);
