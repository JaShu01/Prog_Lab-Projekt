<?php
header('Content-Type: application/json');

// Start Connection
include '/var/www/html/ajax/includes/connectDB.php';
// получение данных также как и везде 
$storeID = isset($_POST['storeID']) ? $_POST['storeID'] : null;
$periodType = isset($_POST['periodType']) ? $_POST['periodType'] : null;
$periodValue = isset($_POST['periodValue']) ? $_POST['periodValue'] : null;



$sql = "SELECT o.storeID";
// запрос чтобы получить данные о продажаъ ориентирововшись на выбранный view
switch ($periodType) {
    case 'oneMonth':
        $sql .= ", YEAR(o.orderDate) as year, SUM(o.nItems) as pizzaQuantity";
        $sql .= " FROM orders o WHERE o.storeID = '$storeID' AND MONTH(o.orderDate) = $periodValue";
        $sql .= " GROUP BY o.storeID, YEAR(o.orderDate)";
        $sql .= " ORDER BY YEAR(o.orderDate)";
        break;

    case 'threeMonths':
        $startMonth = ($periodValue - 1) * 3 + 1;
        $endMonth = $startMonth + 2;
        $sql .= ", YEAR(o.orderDate) as year, SUM(o.nItems) as pizzaQuantity";
        $sql .= " FROM orders o WHERE o.storeID = '$storeID' AND MONTH(o.orderDate) BETWEEN $startMonth AND $endMonth";
        $sql .= " GROUP BY o.storeID, YEAR(o.orderDate)";
        $sql .= " ORDER BY YEAR(o.orderDate)";
        break;

    case 'sixMonths':
        $startMonth = ($periodValue == 1) ? 1 : 7;
        $endMonth = ($periodValue == 1) ? 6 : 12;
        $sql .= ", YEAR(o.orderDate) as year, SUM(o.nItems) as pizzaQuantity";
        $sql .= " FROM orders o WHERE o.storeID = '$storeID' AND MONTH(o.orderDate) BETWEEN $startMonth AND $endMonth";
        $sql .= " GROUP BY o.storeID, YEAR(o.orderDate)";
        $sql .= " ORDER BY YEAR(o.orderDate)";
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'No parameter']);
        exit;
}

$multipleDataset = true;

include '/var/www/html/ajax/includes/makeQuery.php';
?>
