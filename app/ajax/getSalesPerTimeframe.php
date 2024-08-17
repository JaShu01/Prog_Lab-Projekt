<?php
// file for ajax request to get sales figures for a time frame. Needs input view, mode and depending on selected view the input year/month/week
// Verify input
include './includes/checkInput.php';
// Start Connection
include '/var/www/html/ajax/includes/connectDB.php';

// Check connection
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Prepare and execute SQL query

if ($storeSelection == true && $storeSelection != 'all') {
    // set filter depending on if there is already one before
    $storeFilter = ($view === 'completeView') ? '  WHERE ' : ' AND ';
    $storeFilter .= " o.storeID = \"$storeSelection\" ";
} else {
    $storeFilter = '';
}

// set the selected field depending on the view


switch ($view) {
    case 'completeView':
        $sql = "SELECT YEAR(o.orderDate) as sellingYear";
        break;
    case 'yearView':
        $sql = "SELECT MONTH(o.orderDate) as sellingMonth";
        break;
    case 'monthView':
        //$sql = "SELECT WEEK(o.orderDate, 1) as sellingWeek";
        $sql = "SELECT DAY(o.orderDate) as sellingDay";
        break;
    case 'weekView':
        $sql = "SELECT DAYNAME(o.orderDate) as sellingDay";
        break;
}

// seperate per pizza or not
if ($perPizza == "true") {
    $sql .= ", pizzaName";
    $groupByPizza = ', pizzaName';
    $multipleDataset = true;
    $joinForPerPizza  = 'JOIN orderItems oi ON o.orderID = oi.orderID
                         JOIN products p on p.sku = oi.sku ';
} else {
    $groupByPizza = '';
    $joinForPerPizza  = '';
}

// set the mode 
if ($mode === 'units') {
    $sql .= ", SUM(o.nItems) as unitsSold";
} else {
    $sql .= ", SUM(o.total) as revenue";
}

$sql .= " FROM orders o $joinForPerPizza";

// set the where and group statement depending on the view
switch ($view) {
    case 'completeView':
        $sql .= "$storeFilter
                 GROUP BY sellingYear $groupByPizza ORDER BY sellingYear";
        break;
    case 'yearView':
        $sql .= " WHERE YEAR(o.orderDate) = $year
                    $storeFilter
                GROUP BY sellingMonth $groupByPizza
                ORDER BY sellingMonth";
        break;
    case 'monthView':
        $sql .= " WHERE YEAR(o.orderDate) = $year AND MONTH(o.orderDate) = $month
                    $storeFilter
                GROUP BY sellingDay $groupByPizza
                ORDER BY sellingDay";
        //         GROUP BY sellingWeek
        //         ORDER BY sellingWeek";
        break;
    case 'weekView':
        $sql .= " WHERE YEAR(o.orderDate) = $year AND WEEK(o.orderDate, 1) = $week
                    $storeFilter
                GROUP BY WEEKDAY(o.orderDate), sellingDay $groupByPizza
                ORDER BY WEEKDAY(o.orderDate)";
        break;
}

//make query and return result
include '/var/www/html/ajax/includes/makeQuery.php';
