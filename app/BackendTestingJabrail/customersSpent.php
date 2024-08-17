<?php
header('Content-Type: application/json');

// функция о получении данных о покупка выбранного клиента
include '/var/www/html/ajax/includes/connectDB.php';

$customerID = isset($_POST['customerID']) ? $_POST['customerID'] : null;

// запрос sql для получения данных ; подсчет для средних и абсолютных сумм
$sql = "
    SELECT 
        o.customerID,
        COUNT(o.orderID) AS orderCount,
        SUM(o.nItems) AS totalItems,
        SUM(o.total) AS totalSpent,
        AVG(p.Price) AS averageItemPrice,
        (SUM(o.total) / COUNT(o.orderID)) AS averageOrderValue
    FROM 
        orders o
    JOIN 
        orderItems oi ON o.orderID = oi.orderID
    JOIN 
        products p ON oi.SKU = p.SKU
    WHERE 
        o.customerID = '$customerID'
    GROUP BY 
        o.customerID
";

$multipleDataset = true;

include '/var/www/html/ajax/includes/makeQueryExtra.php';
?>