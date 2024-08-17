<?php

header('Content-Type: application/json');


// include the DB connect file. ../ because its outside of this folder
include '/var/www/html/ajax/includes/connectDB.php';



$sql = "SELECT storeID,latitude, longitude
from stores";

$multipleDataset = true;


//make query and return result
include '/var/www/html/ajax/includes/makeQuery.php';
