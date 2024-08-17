<?php
// Perform 
$result = $conn->query($sql);
// Close connection
$conn->close();

if ($result) {
    
    $data = [];

    if (isset($multipleDataset)) {
        $fields = $result->fetch_fields();
        $setLabel = $fields[0]->name; // what is the indentifier of one dataset
        $xLabel = $fields[1]->name;     // what will be the x axis
        $yLabel = $fields[2]->name;     // what will be the y axis


        foreach ($result as $row) {

            $columns = array_values($row); // Get the row values as an array
            $storeID = $columns[0];        // First column is storeID
            $x = $columns[1]; // Combining second and third columns to form x
            $y = $columns[2];         // Fourth column is y

            if (!isset($data[$storeID])) {
                $data[$storeID] = [
                    $setLabel => $storeID,
                    'data' => []
                ];
            }

            $data[$storeID]['data'][] = [$xLabel => $x, $yLabel => $y];
        }

        // Re-index the array to match the desired output format
        $output = array_values($data);

        // Convert to JSON and send response
        header('Content-Type: application/json');
        //esecho json_encode($output, JSON_PRETTY_PRINT);
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