<?php

// include the DB connect file. ../ because its outside of this folder
include '../connectDB.php';

$sql = "SELECT p.pizzaName, p.pizzaSize, p.Price, COUNT(oi.SKU) as soldPizzas, p.Price * COUNT(oi.SKU) as RevenuePerPizza
        FROM products p 
        JOIN orderItems oi ON oi.SKU = p.SKU 
        JOIN orders o ON o.orderID = oi.orderID 
        GROUP BY p.pizzaName, p.pizzaSize, p.Price";

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
