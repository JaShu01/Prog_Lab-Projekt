<?php
header('Content-Type: application/json');


include '/var/www/html/ajax/includes/connectDB.php';

$storeID = isset($_POST['storeID']) ? $_POST['storeID'] : null;
$periodType = isset($_POST['periodType']) ? $_POST['periodType'] : null;
$periodValue = isset($_POST['periodValue']) ? $_POST['periodValue'] : null;

// также как и взде получение данных для различных views

$sql = "SELECT o.storeID";

switch ($periodType) {

    case 'oneMonth':
        $sql .= ", YEAR(o.orderDate) as year, MONTH(o.orderDate) as month, SUM(o.total) as revenue";
        $sql .= " FROM orders o WHERE o.storeID = '$storeID' AND MONTH(o.orderDate) = $periodValue";
        $sql .= " GROUP BY o.storeID, YEAR(o.orderDate), MONTH(o.orderDate)";
        $sql .= " ORDER BY YEAR(o.orderDate), MONTH(o.orderDate)";
        break;
    
    case 'threeMonths':
        $startMonth = ($periodValue - 1) * 3 + 1;
        $endMonth = $startMonth + 2;
        $sql .= ", YEAR(o.orderDate) as year, SUM(o.total) as revenue";
        $sql .= " FROM orders o WHERE o.storeID = '$storeID' AND MONTH(o.orderDate) BETWEEN $startMonth AND $endMonth";
        $sql .= " GROUP BY o.storeID, YEAR(o.orderDate)";
        $sql .= " ORDER BY YEAR(o.orderDate)";
        break;
    
    case 'sixMonths':
        $startMonth = ($periodValue == 1) ? 1 : 7;
        $endMonth = ($periodValue == 1) ? 6 : 12;
        $sql .= ", YEAR(o.orderDate) as year, SUM(o.total) as revenue";
        $sql .= " FROM orders o WHERE o.storeID = '$storeID' AND MONTH(o.orderDate) BETWEEN $startMonth AND $endMonth";
        $sql .= " GROUP BY o.storeID, YEAR(o.orderDate)";
        $sql .= " ORDER BY YEAR(o.orderDate)";
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'No parameter']);
        exit;
}

$multipleDataset = true;

include '/var/www/html/ajax/includes/makeQueryExtra.php';
?>

