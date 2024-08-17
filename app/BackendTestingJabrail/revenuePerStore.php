<?php
header('Content-Type: application/json');

// Start Connection
include '/var/www/html/ajax/includes/connectDB.php';

$storeID = isset($_POST['storeID']) ? $_POST['storeID'] : null;
$view = isset($_POST['view']) ? $_POST['view'] : null;
$year = isset($_POST['year']) ? $_POST['year'] : null;

//функция получение денег через магазин немного лагает


$sql = "SELECT o.storeID";

switch ($view) {
    case 'yearView':
        $sql .= ", YEAR(o.orderDate) as period, SUM(o.total) as revenue";
        $sql .= " FROM orders o WHERE o.storeID = '$storeID'";
        $sql .= " GROUP BY o.storeID, YEAR(o.orderDate)";
        $sql .= " ORDER BY YEAR(o.orderDate)";
        break;
    
    case 'monthView':
        $sql .= ", YEAR(o.orderDate) as year, MONTH(o.orderDate) as period, SUM(o.total) as revenue";
        $sql .= " FROM orders o WHERE o.storeID = '$storeID' AND YEAR(o.orderDate) = $year";
        $sql .= " GROUP BY o.storeID, YEAR(o.orderDate), MONTH(o.orderDate)";
        $sql .= " ORDER BY YEAR(o.orderDate), MONTH(o.orderDate)";
        break;
    
    case 'weekView':
        $sql .= ", YEAR(o.orderDate) as year, WEEK(o.orderDate, 1) as period, SUM(o.total) as revenue";
        $sql .= " FROM orders o WHERE o.storeID = '$storeID' AND YEAR(o.orderDate) = $year";
        $sql .= " GROUP BY o.storeID, YEAR(o.orderDate), WEEK(o.orderDate, 1)";
        $sql .= " ORDER BY YEAR(o.orderDate), WEEK(o.orderDate, 1)";
        break;
    case 'dayView':
        $sql = "SELECT o.storeID, 
                SUM(CASE WHEN TIME(o.orderDate) BETWEEN '06:00:00' AND '11:59:59' THEN o.total ELSE 0 END) AS Morning,
                SUM(CASE WHEN TIME(o.orderDate) BETWEEN '12:00:00' AND '15:59:59' THEN o.total ELSE 0 END) AS Lunch,
                SUM(CASE WHEN TIME(o.orderDate) BETWEEN '16:00:00' AND '21:59:59' THEN o.total ELSE 0 END) AS Evening,
                SUM(CASE WHEN TIME(o.orderDate) BETWEEN '22:00:00' AND '05:59:59' THEN o.total ELSE 0 END) AS Night
                FROM orders o
                WHERE o.storeID = '$storeID' AND YEAR(o.orderDate) = $year
                GROUP BY o.storeID";
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid view parameter']);
        exit;
}


$multipleDataset = true;

include '/var/www/html/ajax/includes/makeQueryExtra.php';
?>
