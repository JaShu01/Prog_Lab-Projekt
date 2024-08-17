<?php
// file for ajax request to get sales figures per Store for a time frame. Needs input view, mode and depending on selected view the input year/month/week
// Verify input
include '/var/www/html/ajax/includes/checkInput.php';
// Start Connection
include '/var/www/html/ajax/includes/connectDB.php';


// set the selected field depending on the view
// Prepare and execute SQL query
$sql = "SELECT o.storeID,";
$sql .= " (YEAR(o.orderDate)*100 + MONTH(o.orderDate)) as sellingMonth,";

// set the mode
if ($mode === 'units') {
    $sql .= "SUM(o.nItems) as unitsSold";
} else {
    $sql .= "SUM(o.total) as revenue";
}

$sql .= " FROM orders o ";

if ($storeSelection == true && $storeSelection!= 'all') {
    $sql .= "WHERE o.storeID = \"$storeSelection\"";
} 



$sql .=  " GROUP BY o.storeID";
$sql .=  " , sellingMonth";
$sql .= " ORDER BY o.storeID, sellingMonth";

// if query has mutliple dataset with first column as identifier and second and third as data
$multipleDataset = true;


include '/var/www/html/ajax/includes/makeQuery.php';

