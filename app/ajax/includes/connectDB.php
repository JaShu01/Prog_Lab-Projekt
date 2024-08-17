<?php
$servername = "mysql"; // This should match the service name in the docker-compose.yml
$username = "root";
$password = "1234";
$dbname = "pizzaDB";
$port = 3306;

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
