<?php
header('Content-Type: application/json');

// Start Connection
include '/var/www/html/ajax/includes/connectDB.php';

$storeID = isset($_POST['storeID']) ? $_POST['storeID'] : null;
$customerID = isset($_POST['customerID']) ? $_POST['customerID'] : null;
$view = isset($_POST['view']) ? $_POST['view'] : null;
$distance = isset($_POST['distance']) ? $_POST['distance'] : null;
 

// функция с дистанциями сделанная по формуле из интернета

switch ($view) {
    case 'allStoresDistance':
        $sql = "
            SELECT 
                s.storeID,
                ROUND(
                    111.111 * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(c.latitude))
                    * COS(RADIANS(s.latitude))
                    * COS(RADIANS(c.longitude - s.longitude))
                    + SIN(RADIANS(c.latitude))
                    * SIN(RADIANS(s.latitude))))) 
                , 2) AS distanceToStore,
                IF(EXISTS(
                    SELECT 1 FROM orders o WHERE o.storeID = s.storeID AND o.customerID = '$customerID'
                ), 'yes', 'no') AS placedOrder
            FROM 
                stores s
            JOIN
                customers c ON c.customerID = '$customerID'
        ";
        break;
    case 'storesInArea':
        if (!$distance) {
            echo json_encode(['success' => false, 'message' => 'Missing distance for storesInArea view']);
            exit;
        }
        $sql = "
            SELECT 
                s.storeID,
                ROUND(
                    111.111 * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(c.latitude))
                    * COS(RADIANS(s.latitude))
                    * COS(RADIANS(c.longitude - s.longitude))
                    + SIN(RADIANS(c.latitude))
                    * SIN(RADIANS(s.latitude))))) 
                , 2) AS distanceToStore,
                IF(EXISTS(
                    SELECT 1 FROM orders o WHERE o.storeID = s.storeID AND o.customerID = '$customerID'
                ), 'yes', 'no') AS placedOrder
            FROM 
                stores s
            JOIN
                customers c ON c.customerID = '$customerID'
            HAVING distanceToStore <= $distance
        ";
        break;
    case 'storesPlacedOrder':
        $sql = "
            SELECT 
                s.storeID,
                ROUND(
                    111.111 * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(c.latitude))
                    * COS(RADIANS(s.latitude))
                    * COS(RADIANS(c.longitude - s.longitude))
                    + SIN(RADIANS(c.latitude))
                    * SIN(RADIANS(s.latitude))))) 
                , 2) AS distanceToStore,
                'yes' AS placedOrder
            FROM 
                stores s
            JOIN 
                orders o ON o.storeID = s.storeID AND o.customerID = '$customerID'
            JOIN
                customers c ON c.customerID = '$customerID'
            GROUP BY s.storeID
        ";
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid view']);
        exit;
}

$multipleDataset = true;
include '/var/www/html/ajax/includes/makeQueryExtra.php';
?>
