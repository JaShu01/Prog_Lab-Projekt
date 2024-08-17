<?php
// file for ajax request to get sales figures per Store for a time frame. Needs input view, mode and depending on selected view the input year/month/week

header('Content-Type: application/json');

// Start Connection
include '/var/www/html/ajax/includes/connectDB.php';

// Verify input
include '/var/www/html/ajax/includes/checkInput.php';

// initialize sql query
$sql = '';

if ($mode === 'revenue') {
    $sql .= "select sub.storeID, sum(sub.unitsSold*p.price) as unitsSold
            FROM (";
}


// set the selected field depending on the view
// Prepare and execute SQL query
$sql .= "SELECT o.storeID, count(oi.sku) as unitsSold";


if ($mode === 'revenue') {
    $sql .= ", oi.sku ";
}

$sql .= " FROM orders o
            join orderItems oi ON o.orderID = oi.orderID";
        

// set the where and group statement depending on the view
switch ($view) {
    case 'completeView':
        break;
    case 'yearView':
        $sql .= " WHERE YEAR(o.orderDate) = $year";
        break;
    case 'monthView':
        $sql .= " WHERE YEAR(o.orderDate) = $year AND MONTH(o.orderDate) = $month";
        break;
    case 'weekView':
        $sql .= " WHERE YEAR(o.orderDate) = $year AND WEEK(o.orderDate, 1) = $week";
        break;
}

$sql .=  " GROUP BY o.storeID";


if ($mode === 'units') {
    $sql .= " ORDER BY unitsSold desc";
} elseif ($mode === 'revenue') {
    $sql .= ", oi.sku) as sub
            JOIN products p on p.sku=sub.sku
            GROUP BY sub.storeID
            ORDER BY unitsSold desc";
}

//make query and return result
include '/var/www/html/ajax/includes/makeQuery.php';
