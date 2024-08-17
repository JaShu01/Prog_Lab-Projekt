<?php
header('Content-Type: application/json');

// Start Connection
include '/var/www/html/ajax/includes/connectDB.php';

// Verify input
include '/var/www/html/ajax/includes/checkInput.php';

if ($storeSelection == true && $storeSelection!= 'all') {
    // set filter depending on if there is already one before
    $storeFilter = ($view === 'completeView') ? ' JOIN orders o ON o.orderID = oi.orderID WHERE ' : ' AND ';
    $storeFilter .= " o.storeID = \"$storeSelection\" ";
} else {
    $storeFilter = '';
}

$sql = "SELECT p.pizzaName,";

// seperate per pizza size or not
if ($perSize == "true") {
    $sql .= " pizzaSize,";
};

// select units sold or revenu
if ($mode === 'revenue') {
    $sql .= " sum(sub.unitsSold*p.price) as revenue ";
} elseif ($mode === 'units') {
    $sql .= " sum(sub.unitsSold) as unitsSold ";
};

$sql .= " FROM (
            SELECT oi.sku, COUNT(oi.SKU) as unitsSold 
            FROM orderItems oi ";

// filter depending on view
switch ($view) {
    case 'completeView':
        $sql .= "$storeFilter";

        break;
    case 'yearView':
        $sql .= " JOIN orders o ON o.orderID = oi.orderID 
                    WHERE YEAR(o.orderDate) = $year
                    $storeFilter ";
        break;
    case 'monthView':
        $sql .= " JOIN orders o ON o.orderID = oi.orderID 
                    WHERE YEAR(o.orderDate) = $year AND MONTH(o.orderDate) = $month
                    $storeFilter ";
        break;
    case 'weekView':
        $sql .= " JOIN orders o ON o.orderID = oi.orderID 
                    WHERE YEAR(o.orderDate) = $year AND WEEK(o.orderDate, 1) = $week
                    $storeFilter ";
        break;
}

$sql .= " GROUP BY oi.sku";

// join with product table to fetch the name after counting -> faster as less joins to make
$sql .= " ) as sub JOIN products p on p.sku = sub.sku
            GROUP BY p.pizzaName";

// seperate per pizza size or not
if ($perSize == "true") {
    $sql .= ", p.pizzaSize";
    $multipleDataset = true;
};
$sql .= " ORDER BY p.pizzaName";


//make query and return result
include '/var/www/html/ajax/includes/makeQuery.php';
