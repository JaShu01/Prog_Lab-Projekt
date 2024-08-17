<?php

// include the DB connect file. ../ because its outside of this folder
include '../connectDB.php';

$sql = "SELECT
            p.pizzaName as name1,
            p2.pizzaName as name2               
        FROM
            products p
        JOIN orderItems oi on
            oi.sku = p.sku
        JOIN orderItems oi2 on
            oi.orderID = oi2.orderID
        JOIN products p2 on
            oi2.sku = p2.sku
        WHERE
            oi.orderItemID != oi2.orderItemID 
        AND oi.orderID <11
        order by
            oi.orderID";

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
