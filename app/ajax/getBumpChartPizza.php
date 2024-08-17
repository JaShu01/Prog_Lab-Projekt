<?php
// Get Top X rank pizza base on time and revenue or units sold
// Needs input view, mode and depending on selected view the input year/month/week
// can take a limit of ranked places (e.g. top 5), default if not set is 10

header('Content-Type: application/json');

// Start Connection
include '/var/www/html/ajax/includes/connectDB.php';

// Verify input
include '/var/www/html/ajax/includes/checkInput.php';



$measuredValue = ($mode === 'revenue') ? ' SUM(salesPerSKU*p.price) ' : ' SUM(salesPerSKU) ';
$pizzaGranularity = ($perSize == "true") ? ' CONCAT(p.pizzaName, \' - \', p.pizzaSize) as pizza' : ' pizzaName as pizza';

// Determine the time period and partition by clause
// Determine time period, partition by, group by, and ranking frame based on view
switch ($view) {
    case 'completeView':
        $timePeriod = 'YEAR(o.orderDate) as sellingYear';
        $partitionBy = 'YEAR(o.orderDate)';
        $groupBy = 'sellingYear';
        $rankingFrame = 'yearlyRank';
        $timeFilter = '';
        break;
    case 'yearView':
        $timePeriod = "DATE_FORMAT(o.orderDate, '%Y-%m') as sellingMonth";
        $partitionBy = "DATE_FORMAT(o.orderDate, '%Y-%m')";
        $groupBy = 'sellingMonth';
        $rankingFrame = 'monthlyRank';
        $timeFilter = "WHERE YEAR(o.orderDate) = $year";
        break;
    case 'monthView':
        $timePeriod = 'DATE(o.orderDate) as sellingDay';
        $partitionBy = 'DATE(o.orderDate)';
        $groupBy = 'sellingDay';
        $rankingFrame = 'dailyRank';
        $timeFilter = "WHERE YEAR(o.orderDate) = $year AND MONTH(o.orderDate) = $month";
        break;
    case 'weekView':
        $timePeriod = 'DATE(o.orderDate) as sellingDay';
        $partitionBy = 'DATE(o.orderDate)';
        $groupBy = 'sellingDay';
        $rankingFrame = 'dailyRank';
        $timeFilter = "WHERE YEAR(o.orderDate) = $year AND WEEK(o.orderDate, 1) = $week";
        break;
}

if($storeSelection == true && $storeSelection!= 'all'){
    $storeFilter = ($timeFilter === '') ? ' WHERE ' : ' AND '; // add where or and depending if a where clause is already there
    $storeFilter .= " o.storeID = \"$storeSelection\"";
} else {
    $storeFilter = '';
}



// Construct the SQL query
$sql = "SELECT pizza , $groupBy, $rankingFrame
        FROM (
            SELECT $pizzaGranularity , $groupBy, RANK() OVER (PARTITION BY $groupBy ORDER BY $measuredValue DESC) AS $rankingFrame
            FROM (
                SELECT oi.sku, $timePeriod, COUNT(oi.sku) as salesPerSKU
                FROM orders o
                JOIN orderItems oi ON o.orderID = oi.orderID
                $timeFilter
                $storeFilter
                GROUP BY oi.sku, $groupBy
            ) as subsub
            JOIN products p ON p.sku = subsub.sku
            GROUP BY pizza , $groupBy
        ) as sub
        WHERE $rankingFrame <= $rankingSize
        ORDER BY $groupBy, $rankingFrame";



// For Debugging the sql query
// echo $sql;

$multipleDataset = true;

//make query and return result
include '/var/www/html/ajax/includes/makeQuery.php';
