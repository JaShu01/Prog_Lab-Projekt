<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$result = $conn->query($sql);

// Close connection
$conn->close();

if ($result) {
    $data = [];

    if (isset($multipleDataset)) {
        $fields = $result->fetch_fields();
        $setLabel = $fields[0]->name; // what is the identifier of one dataset
        $xLabel1 = $fields[1]->name ?? null;  // what will be the first x axis
        $xLabel2 = count($fields) > 2 ? $fields[2]->name : null; // what will be the second x axis, if it exists
        $xLabel3 = count($fields) > 3 ? $fields[3]->name : null; // what will be the third x axis, if it exists
        $xLabel4 = count($fields) > 4 ? $fields[4]->name : null; // what will be the fourth x axis, if it exists
        $xLabel5 = count($fields) > 5 ? $fields[5]->name : null; // what will be the fifth x axis, if it exists
        $lastLabel = $fields[count($fields) - 1]->name; // what will be the y axis (revenue)

        foreach ($result as $row) {
            $columns = array_values($row); // Get the row values as an array
            $storeID = $columns[0];        // First column is storeID
            $x1 = $columns[1] ?? null;     // Second column is the first x axis
            $x2 = $xLabel2 ? ($columns[2] ?? null) : null; // Third column is the second x axis if it exists
            $x3 = $xLabel3 ? ($columns[3] ?? null) : null; // Fourth column is the third x axis if it exists
            $x4 = $xLabel4 ? ($columns[4] ?? null) : null; // Fifth column is the fourth x axis if it exists
            $x5 = $xLabel5 ? ($columns[5] ?? null) : null; // Sixth column is the fifth x axis if it exists
            $y = $columns[count($columns) - 1]; // Last column is the y axis (revenue)

            if (!isset($data[$storeID])) {
                $data[$storeID] = [
                    $setLabel => $storeID,
                    'data' => []
                ];
            }

            $dataEntry = [$xLabel1 => $x1, $lastLabel => $y];
            if ($x2 !== null) {
                $dataEntry[$xLabel2] = $x2;
            }
            if ($x3 !== null) {
                $dataEntry[$xLabel3] = $x3;
            }
            if ($x4 !== null) {
                $dataEntry[$xLabel4] = $x4;
            }
            if ($x5 !== null) {
                $dataEntry[$xLabel5] = $x5;
            }

            $data[$storeID]['data'][] = $dataEntry;
        }

        // Re-index the array to match the desired output format
        $output = array_values($data);

        // Convert to JSON and send response
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'data' => $output]);
    } else {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode(['success' => true, 'data' => $data]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Query failed: ' . $conn->error]);
}
?>
