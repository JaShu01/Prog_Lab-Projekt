<?php
header('Content-Type: application/json');

// Start Connection
include '/var/www/html/ajax/includes/connectDB.php';

$storeID = $_POST['storeID'];

if ($storeID === 'All') {
    $sql = "SELECT * from stores";
} else {
    $sql = "SELECT * from stores where storeID = \"$storeID\"";
}


include '/var/www/html/ajax/includes/makeQuery.php';
?>
