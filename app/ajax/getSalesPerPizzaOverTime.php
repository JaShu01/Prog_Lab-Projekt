<?php
header('Content-Type: application/json');


// Start Connection
include '/var/www/html/ajax/includes/connectDB.php';

// Verify input
include '/var/www/html/ajax/includes/checkInput.php';

if ($storeSelection == true && $storeSelection != 'all') {
        // set filter depending on if there is already one before
        $storeFilter = ($view === 'completeView') ? '  WHERE ' : ' AND ';
        $storeFilter .= " o.storeID = \"$storeSelection\" ";
} else {
        $storeFilter = '';
}

if ($view == 'completeView' || $view == 'yearView') {
        $sql = "SELECT p.pizzaName, sub.sellingMonth";
} elseif ($view == 'monthView' || $view == 'weekView') {
        $sql = "SELECT p.pizzaName, sub.sellingDay";
}

if ($mode === 'units') {
        $sql .= ", sum(sub.soldPizzas) as unitsSold ";
} elseif ($mode === 'revenue') {
        $sql .= ", sum(sub.soldPizzas*p.price) as revenue";
}


$sql .= " FROM (SELECT
                oi.sku,";
switch ($view) {
        case 'completeView':
                $sql .= " DATE_FORMAT(o.orderDate, '%Y-%m') as sellingMonth, ";
                break;
        case 'yearView':
                $sql .= " DATE_FORMAT(o.orderDate, '%Y-%m') as sellingMonth, ";
                break;
        case 'monthView':
                $sql .= " DATE(o.orderDate) as sellingDay, ";
                break;
        case 'weekView':
                $sql .= " DATE(o.orderDate) as sellingDay, ";
                break;
}

$sql .= " COUNT(oi.SKU) as soldPizzas
        FROM orderItems oi
        JOIN orders o ON o.orderID = oi.orderID ";


switch ($view) {
        case 'completeView':
                $sql .= "$storeFilter";
                break;
        case 'yearView':
                $sql .= " WHERE YEAR(o.orderDate) = $year
                                $storeFilter";
                break;
        case 'monthView':
                $sql .= " WHERE YEAR(o.orderDate) = $year AND MONTH(o.orderDate) = $month
                                $storeFilter";
                break;
        case 'weekView':
                $sql .= " WHERE YEAR(o.orderDate) = $year AND WEEK(o.orderDate, 1) = $week
                                $storeFilter";
                break;
}
if ($view == 'completeView' || $view == 'yearView') {
        $sql .= " GROUP BY oi.sku, sellingMonth) as sub
                JOIN products p on p.sku=sub.sku
                GROUP BY p.pizzaName , sellingMonth
                ORDER BY p.pizzaName, sellingMonth";
} elseif ($view == 'monthView' || $view == 'weekView') {
        $sql .= " GROUP BY oi.sku, sellingDay) as sub
                JOIN products p on p.sku=sub.sku
                GROUP BY p.pizzaName , sellingDay
                ORDER BY p.pizzaName, sellingDay";
}

// if query has mutliple dataset with first column as identifier and second and third as data
$multipleDataset = true;

//make query and return result
include '/var/www/html/ajax/includes/makeQuery.php';
