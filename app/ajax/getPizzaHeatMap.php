<?php

header('Content-Type: application/json');

// include the DB connect file. ../ because its outside of this folder
include '/var/www/html/ajax/includes/connectDB.php';

include '/var/www/html/ajax/includes/checkInput.php';

switch ($view) {
    case 'completeView':
        $timeFilter = '';
        break;
    case 'yearView':
        $timeFilter = "AND YEAR(orderDate) = $year";
        break;
    case 'monthView':
        $timeFilter = "AND YEAR(orderDate) = $year AND MONTH(orderDate) = $month";
        break;
    case 'weekView':
        $timeFilter = "AND YEAR(orderDate) = $year AND WEEK(orderDate, 1) = $week";
        break;
}

if ($storeSelection == true && $storeSelection!= 'all') {
    $storeFilter = " AND o.storeID = \"$storeSelection\"";
} else {
    $storeFilter = '';
}

$sql = "WITH ordMult as (SELECT oi.orderID,
                        orderItemID,
                        oi.sku as sku
                 FROM orders o
                          JOIN orderItems oi on oi.orderID = o.orderID
                 WHERE nItems > 1 
                    $timeFilter
                    $storeFilter
                 order by orderID)


SELECT p.pizzaName as x, p2.pizzaName as y, sum(skuSum) as v
FROM (SELECT sku1, sku2, COUNT(*) as skuSum
      FROM (SELECT ordMult1.sku as sku1, ordMult2.sku as sku2
            FROM ordMult ordMult1
                     JOIN ordMult ordMult2 on
                ordMult1.orderID = ordMult2.orderID
            where ordMult1.orderItemID != ordMult2.orderItemID) as subsub
      GROUP BY sku1, sku2) as sub
         JOIN products p on p.sku = sub.sku1
         JOIN products p2 on p2.sku = sub.sku2
GROUP BY p.pizzaName, p2.pizzaName
ORDER BY p.pizzaName, p2.pizzaName";

// Make query and return result
include '/var/www/html/ajax/includes/makeQuery.php';

// $sql = "SELECT
//             p.pizzaName as name1,
//             p2.pizzaName as name2
//         FROM
//             products p
//         JOIN orderItems oi on
//             oi.sku = p.sku
//         JOIN orderItems oi2 on
//             oi.orderID = oi2.orderID
//         JOIN products p2 on
//             oi2.sku = p2.sku
//         WHERE
//             oi.orderItemID < oi2.orderItemID";

// $result = $conn->query($sql);


// // Pizza mapping in alphabetical order
// $pizzaMap = [
//     "BBQ Chicken Pizza" => 0,
//     "Buffalo Chicken Pizza" => 1,
//     "Hawaiian Pizza" => 2,
//     "Margherita Pizza" => 3,
//     "Meat Lover's Pizza" => 4,
//     "Oxtail Pizza" => 5,
//     "Pepperoni Pizza" => 6,
//     "Sicilian Pizza" => 7,
//     "Veggie Pizza" => 8,
// ];

// // Initialize 9x9 heatmap
// $heatmap = array_fill(0, 9, array_fill(0, 9, 0));

// // Process query result
// if ($result) {
//     while ($row = $result->fetch_assoc()) {
//         $pizza1 = $row['name1'];
//         $pizza2 = $row['name2'];

//         // Debugging output to verify pizzas
//         error_log("Processing row: $pizza1, $pizza2");

//         if (isset($pizzaMap[$pizza1]) && isset($pizzaMap[$pizza2])) {
//             $x = $pizzaMap[$pizza1];
//             $y = $pizzaMap[$pizza2];
//             $heatmap[$x][$y]++;
//             if ($x != $y) {
//                 $heatmap[$y][$x]++;
//             }         

//             // Debugging output to verify increments
//             error_log("Incrementing heatmap[$x][$y]: " . $heatmap[$x][$y]);
//         } else {
//             // Debugging output for unmapped pizzas
//             error_log("Unmapped pizza(s): $pizza1, $pizza2");
//         }
//     }
// } else {
//     // End output buffering and clean buffer
//     ob_end_clean();
//     die(json_encode(["error" => "Query failed: " . $conn->error]));
// }



// $conn->close();


// // Return heatmap as JSON

// echo json_encode(['success' => true, 'data' => $heatmap]);

