<?php
// Get Top X rank Store based on time and revenue or units sold
// Needs input view, mode and depending on selected view the input year/month/week
// Can take a limit of ranked places (e.g., top 5), default if not set is 10

header('Content-Type: application/json');

// Start Connection
include '/var/www/html/ajax/includes/connectDB.php';

// Verify input
include '/var/www/html/ajax/includes/checkInput.php';

// Determine the time period, partition by clause, and group by clause based on the view
switch ($view) {
    case 'completeView':
        $timePeriod = 'YEAR(orderDate) as sellingYear';
        $partitionBy = 'YEAR(orderDate)';
        $groupBy = 'sellingYear';
        $rankingFrame = 'yearlyRank';
        $timeFilter = '';
        break;
    case 'yearView':
        $timePeriod = "DATE_FORMAT(orderDate, '%Y-%m') as sellingMonth";
        $partitionBy = "DATE_FORMAT(orderDate, '%Y-%m')";
        $groupBy = 'sellingMonth';
        $rankingFrame = 'monthlyRank';
        $timeFilter = "WHERE YEAR(orderDate) = $year";
        break;
    case 'monthView':
        $timePeriod = 'DATE(orderDate) as sellingDay';
        $partitionBy = 'DATE(orderDate)';
        $groupBy = 'sellingDay';
        $rankingFrame = 'dailyRank';
        $timeFilter = "WHERE YEAR(orderDate) = $year AND MONTH(orderDate) = $month";
        break;
    case 'weekView':
        $timePeriod = 'DATE(orderDate) as sellingDay';
        $partitionBy = 'DATE(orderDate)';
        $groupBy = 'sellingDay';
        $rankingFrame = 'dailyRank';
        $timeFilter = "WHERE YEAR(orderDate) = $year AND WEEK(orderDate, 1) = $week";
        break;
}

// Determine the order by clause based on the mode
$orderBy = ($mode === 'revenue') ? 'SUM(total)' : 'SUM(nItems)';

// Construct the SQL query
$sql = "SELECT storeID, $groupBy, $rankingFrame
        FROM (
            SELECT storeID, $timePeriod, 
                   RANK() OVER (PARTITION BY $partitionBy ORDER BY $orderBy DESC) AS $rankingFrame
            FROM orders
            $timeFilter
            GROUP BY storeID, $groupBy
        ) AS rankedSales
        WHERE $rankingFrame <= $rankingSize
        ORDER BY $groupBy, $rankingFrame";

// For Debugging the SQL query
// echo $sql;

$multipleDataset = true;

// Make query and return result
include '/var/www/html/ajax/includes/makeQuery.php';
?>
