<?php
// функция для дроп дауна с клиентам
header('Content-Type: application/json');


include '/var/www/html/ajax/includes/connectDB.php';
// получение store Id
$storeID = isset($_POST['storeID']) ? $_POST['storeID'] : null;




// Sql запрос для получения данных о клиентах в этом магазе
$sql = "SELECT DISTINCT o.customerID
        FROM orders o
        WHERE o.storeID = '$storeID'
        ORDER BY o.customerID";

$multipleDataset = true;

include '/var/www/html/ajax/includes/makeQueryExtra.php';
?>
