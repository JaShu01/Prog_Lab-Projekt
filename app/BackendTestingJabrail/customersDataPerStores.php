<?php
header('Content-Type: application/json');

// Фунция чтобы получить информацию о клиентах по магазинам
include '/var/www/html/ajax/includes/connectDB.php';

$storeID = isset($_POST['storeID']) ? $_POST['storeID'] : null;
$customerID = isset($_POST['customerID']) ? $_POST['customerID'] : null;


// запрос в базу данных ; используется round для рассчета дистанции по формелу из данных о положении
$sql = "
    SELECT 
        c.customerID,
        COUNT(o.orderID) AS orderCount,
        MAX(o.orderDate) AS lastOrderDate,
        (
            SELECT p.SKU
            FROM orderItems oi
            JOIN products p ON oi.SKU = p.SKU
            WHERE oi.orderID IN (
                SELECT o2.orderID
                FROM orders o2
                WHERE o2.customerID = c.customerID
                  AND o2.storeID = o.storeID
            )
            GROUP BY p.SKU
            ORDER BY COUNT(p.SKU) DESC
            LIMIT 1
        ) AS mostOrderedProduct,
        SUM(o.total) AS totalSpent,
        ROUND( 
            111.111 * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(c.latitude))
            * COS(RADIANS(s.latitude))
            * COS(RADIANS(c.longitude - s.longitude))
            + SIN(RADIANS(c.latitude))
            * SIN(RADIANS(s.latitude))))) 
        , 2) AS distanceToStore
    FROM 
        customers c
    JOIN 
        orders o ON c.customerID = o.customerID
    JOIN
        stores s ON o.storeID = s.storeID
    WHERE 
        o.storeID = '$storeID'
        AND c.customerID = '$customerID'
    GROUP BY 
        c.customerID
";

$multipleDataset = true;

include '/var/www/html/ajax/includes/makeQueryExtra.php';
?>