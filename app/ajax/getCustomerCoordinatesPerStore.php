<?php

header('Content-Type: application/json');


// include the DB connect file. ../ because its outside of this folder
include '/var/www/html/ajax/includes/connectDB.php';
include '/var/www/html/ajax/includes/checkInput.php';

//set filter for time
switch ($view) {
    case 'completeView':
        $timeFilter = '';
        break;
    case 'yearView':
        $timeFilter = "WHERE YEAR(orderDate) = $year";
        break;
    case 'monthView':
        $timeFilter = "WHERE YEAR(orderDate) = $year AND MONTH(orderDate) = $month";
        break;
    case 'weekView':
        $timeFilter = "WHERE YEAR(orderDate) = $year AND WEEK(orderDate, 1) = $week";
        break;
}

if ($storeSelection == true && $storeSelection!= 'all') {
    // set filter depending on if there is already one before
    $storeFilter = ($timeFilter === '') ? ' WHERE ' : ' AND ';
    $storeFilter .= " o.storeID = \"$storeSelection\"";
} else {
    $storeFilter = '';
}


$sql = "SELECT c.customerID, latitude, longitude, visites
        FROM (SELECT o.customerID, COUNT(o.customerID) as visites
            FROM orders o 
            $timeFilter $storeFilter
            GROUP BY o.customerID) as sub
                JOIN customers c on sub.customerID = c.customerID;";


//make query and return result
include '/var/www/html/ajax/includes/makeQuery.php';
