<?php
header('Content-Type: application/json');

// Start Connection
include '/var/www/html/ajax/includes/connectDB.php';

$storeID = isset($_POST['storeID']) ? $_POST['storeID'] : null;
$view = isset($_POST['view']) ? $_POST['view'] : null;
$year = isset($_POST['year']) ? $_POST['year'] : null;

//  получение данных и отправка

$sql = "SELECT o.storeID";
// функции базу данных надо чутка доработать
switch ($view) {
    case 'yearView':
        $sql .= ", YEAR(o.orderDate) as period, COUNT(oi.SKU) as totalPizzas";
        $sql .= " FROM orders o JOIN orderItems oi ON o.orderID = oi.orderID WHERE o.storeID = '$storeID'";
        $sql .= " GROUP BY o.storeID, YEAR(o.orderDate)";
        $sql .= " ORDER BY YEAR(o.orderDate)";
        break;
    
    case 'monthView':
        $sql .= ", YEAR(o.orderDate) as year, MONTH(o.orderDate) as period, COUNT(oi.SKU) as totalPizzas";
        $sql .= " FROM orders o JOIN orderItems oi ON o.orderID = oi.orderID WHERE o.storeID = '$storeID' AND YEAR(o.orderDate) = $year";
        $sql .= " GROUP BY o.storeID, YEAR(o.orderDate), MONTH(o.orderDate)";
        $sql .= " ORDER BY YEAR(o.orderDate), MONTH(o.orderDate)";
        break;
    
    case 'weekView':
        $sql .= ", YEAR(o.orderDate) as year, WEEK(o.orderDate, 1) as period, COUNT(oi.SKU) as totalPizzas";
        $sql .= " FROM orders o JOIN orderItems oi ON o.orderID = oi.orderID WHERE o.storeID = '$storeID' AND YEAR(o.orderDate) = $year";
        $sql .= " GROUP BY o.storeID, YEAR(o.orderDate), WEEK(o.orderDate, 1)";
        $sql .= " ORDER BY YEAR(o.orderDate), WEEK(o.orderDate, 1)";
        break;
    case 'dayView':
        $sql = "SELECT o.storeID, 
                SUM(CASE WHEN TIME(o.orderDate) BETWEEN '06:00:00' AND '11:59:59' THEN 1 ELSE 0 END) AS Morning,
                SUM(CASE WHEN TIME(o.orderDate) BETWEEN '12:00:00' AND '15:59:59' THEN 1 ELSE 0 END) AS Lunch,
                SUM(CASE WHEN TIME(o.orderDate) BETWEEN '16:00:00' AND '21:59:59' THEN 1 ELSE 0 END) AS Evening,
                SUM(CASE WHEN TIME(o.orderDate) BETWEEN '22:00:00' AND '05:59:59' THEN 1 ELSE 0 END) AS Night
                FROM orders o JOIN orderItems oi ON o.orderID = oi.orderID
                WHERE o.storeID = '$storeID' AND YEAR(o.orderDate) = $year
                GROUP BY o.storeID";
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'No parameter']);
        exit;
}

$multipleDataset = true;

include '/var/www/html/ajax/includes/makeQueryExtra.php';
?>
