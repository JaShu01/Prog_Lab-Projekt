// Display any Json table
function displayJsonTable(data, tableContainerId) {
    if (!data || data.length === 0) {
        document.getElementById(tableContainerId).innerHTML = '<p>No data available</p>';
        return;
    }

    // Flatten the data
    let flattenedData = flattenData(data);

    let tableHtml = '<table>';
    tableHtml += '<tr>';

    // Generate table headers based on keys of the first row of flattened data
    const headers = Object.keys(flattenedData[0]);
    headers.forEach(key => {
        tableHtml += '<th>' + key + '</th>';
    });
    tableHtml += '</tr>';

    // Generate table rows
    flattenedData.forEach(row => {
        tableHtml += '<tr>';
        headers.forEach(key => {
            tableHtml += '<td>' + row[key] + '</td>';
        });
        tableHtml += '</tr>';
    });

    tableHtml += '</table>';

    document.getElementById(tableContainerId).innerHTML = tableHtml;

}


// Create a line or bar chart out of any json file 
function createChart(data, chartID, chartType, grouping = "defaultGrouping", isBumpChart = false, stacked = false) {
    var canvas = document.getElementById(chartID);
    var ctx = canvas.getContext('2d');

    // Get the chart instance associated with the canvas
    var chartInstance = Chart.getChart(ctx);

    // Check if the chart instance exists and destroy it if it does
    if (chartInstance) {
        chartInstance.destroy();
    }
    var labels, datasets;
    if ("data" in data[0]) {
        if (stacked == 'true') {
            stacked == true
        } else {
            stacked = false
        }


        if (grouping == 'reversedGrouping') {
            var flatenedData = flattenData(data);
            console.log(grouping);
            data = groupBy(flatenedData, 1);
        }

        var multipleDataset = true;
        // Multiple datasets present
        var displayLegend = true;

        // get the label of the dataset and of the values inside of the datasets for the labels of the axis
        var datasetLabel = Object.keys(data[0])[0];
        var keys = Object.keys(data[0].data[0]);
        var xLabel = keys[0];
        var yLabel = keys[1];
        console.log('Display', chartID, ': Several dataset in data with', datasetLabel, "as identifier and values", xLabel, "and", yLabel);

        // Extract all unique x values for the x axis scale 
        var allXValues = new Set();
        data.forEach(store => {
            store.data.forEach(point => {
                allXValues.add(point[xLabel]);
            });
        });
        labels = Array.from(allXValues).sort();

        // Create datasets
        datasets = data.map(store => {
            return {
                label: store[datasetLabel],
                data: labels.map(x => {
                    var point = store.data.find(p => p[xLabel] === x);
                    return {
                        x: x,
                        y: point ? point[yLabel] : null // Use null for missing data points
                    };
                }),
                fill: false,
                backgroundColor: getColor(store[datasetLabel], 'background', multipleDataset),
                borderColor: getColor(store[datasetLabel], 'border', multipleDataset),
                borderWidth: 1
            };
        });

    } else {

        var multipleDataset = false;
        var displayLegend = false;

        // On dataset present
        // Get the label for the two axis
        var keys = Object.keys(data[0]);
        var xLabel = keys[0];
        var yLabel = keys[1];

        console.log('Display', chartID, ': found one dataset with', xLabel, 'and', yLabel);

        labels = data.map(item => item[xLabel]);
        datasets = [{
            label: 'Dataset',
            data: data.map(item => item[yLabel]),
            fill: false,
            backgroundColor: data.map(item => getColor(item[xLabel], 'background', multipleDataset, chartType)),
            borderColor: data.map(item => getColor(item[xLabel], 'border', multipleDataset, chartType)),
            borderWidth: 1
        }];
    }


    // Create the chart
    new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: datasets,
        },
        options: {
            scales: {
                x: {
                    type: 'category',
                    stacked: stacked,
                    title: {
                        display: true,
                        text: xLabel
                    }
                },
                y: {
                    beginAtZero: true,
                    reverse: isBumpChart,
                    stacked: stacked,
                    title: {
                        display: true,
                        text: yLabel
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return context.dataset.label + ': ' + context.parsed.y;
                        }
                    }
                },
                legend: {
                    display: displayLegend  // Hide the legend
                }
            }
        }
    });
}



// Function to map dataset labels to colors from a predefined palette and apply opacity 
function getColor(datasetLabel, opacity, multipleDataset, chartType = 'default') {
    // Define a color palette with colors corresponding to each dataset label

    // default Color for if the x axis isn't a storeID, without opacity
    var defaultColor = 'rgba(75, 192, 192, ';

    // if the chart is a line chart, option to chose the default color (will be set below)
    if (chartType === 'line' && multipleDataset == false) {
        return 'rgba(75, 192, 192, 1)';
    }

    // map of color for each store without opacity (will be set below)
    const colorPalette = {
        'S013343': 'rgba(255, 99, 132, ',
        'S048150': 'rgba(54, 162, 235, ',
        'S058118': 'rgba(255, 206, 86, ',
        'S062214': 'rgba(75, 192, 192, ',
        'S064089': 'rgba(153, 102, 255, ',
        'S068548': 'rgba(255, 159, 64, ',
        'S080157': 'rgba(255, 99, 132, ',
        'S122017': 'rgba(54, 162, 235, ',
        'S147185': 'rgba(255, 206, 86, ',
        'S216043': 'rgba(75, 192, 192, ',
        'S263879': 'rgba(153, 102, 255, ',
        'S276746': 'rgba(255, 159, 64, ',
        'S302800': 'rgba(255, 99, 132, ',
        'S351225': 'rgba(54, 162, 235, ',
        'S361257': 'rgba(255, 206, 86, ',
        'S370494': 'rgba(75, 192, 192, ',
        'S396799': 'rgba(153, 102, 255, ',
        'S449313': 'rgba(255, 159, 64, ',
        'S476770': 'rgba(255, 99, 132, ',
        'S486166': 'rgba(54, 162, 235, ',
        'S490972': 'rgba(255, 206, 86, ',
        'S505400': 'rgba(75, 192, 192, ',
        'S588444': 'rgba(153, 102, 255, ',
        'S606312': 'rgba(255, 159, 64, ',
        'S669665': 'rgba(255, 99, 132, ',
        'S688745': 'rgba(54, 162, 235, ',
        'S750231': 'rgba(255, 206, 86, ',
        'S799887': 'rgba(75, 192, 192, ',
        'S817950': 'rgba(153, 102, 255, ',
        'S872983': 'rgba(255, 159, 64, ',
        'S918734': 'rgba(255, 99, 132, ',
        'S948821': 'rgba(54, 162, 235, ',
        // for the pizza
        "Margherita Pizza": "rgba(255, 0, 0, ",
        "Pepperoni Pizza": "rgba(255, 123, 46, ",
        "Hawaiian Pizza": "rgba(255, 206, 10, ",
        "Meat Lover's Pizza": "rgba(75, 192, 192, ",
        "Veggie Pizza": "rgba(34, 200, 34, ",
        "BBQ Chicken Pizza": "rgba(160, 81, 36, ",
        "Buffalo Chicken Pizza": "rgba(40, 83, 255, ",
        "Sicilian Pizza": "rgba(123, 40, 238, ",
        "Oxtail Pizza": "rgba(255, 29, 251, ",
        // for pizza size
        "Smale": "rgba(rgba(75, 192, 192, ",
        "Medium": "rgba(54, 130, 235, ",
        "Large": "rgba(153, 102, 255, ",
        "Extra Large": "rgba(123, 40, 238, ",
        // for pizzaName - pizzaSize
        "Margherita Pizza - Small": "rgba(255, 99, 132, ", // Original color
        "Margherita Pizza - Medium": "rgba(255, 79, 112, ", // Darker shade
        "Margherita Pizza - Large": "rgba(255, 59, 92, ", // Even darker
        "Margherita Pizza - Extra Large": "rgba(255, 39, 72, ", // Darkest shade

        "Pepperoni Pizza - Small": "rgba(54, 130, 235, ", // Original color
        "Pepperoni Pizza - Medium": "rgba(44, 120, 225, ", // Darker shade
        "Pepperoni Pizza - Large": "rgba(34, 110, 215, ", // Even darker
        "Pepperoni Pizza - Extra Large": "rgba(24, 100, 205, ", // Darkest shade

        "Hawaiian Pizza - Small": "rgba(255, 206, 86, ", // Original color
        "Hawaiian Pizza - Medium": "rgba(235, 186, 76, ", // Darker shade
        "Hawaiian Pizza - Large": "rgba(215, 166, 66, ", // Even darker
        "Hawaiian Pizza - Extra Large": "rgba(195, 146, 56, ", // Darkest shade

        "Meat Lover's Pizza - Small": "rgba(75, 192, 192, ", // Original color
        "Meat Lover's Pizza - Medium": "rgba(65, 182, 182, ", // Darker shade
        "Meat Lover's Pizza - Large": "rgba(55, 172, 172, ", // Even darker
        "Meat Lover's Pizza - Extra Large": "rgba(45, 162, 162, ", // Darkest shade

        "Veggie Pizza - Small": "rgba(34, 139, 34, ", // Original color
        "Veggie Pizza - Medium": "rgba(24, 129, 24, ", // Darker shade
        "Veggie Pizza - Large": "rgba(14, 119, 14, ", // Even darker
        "Veggie Pizza - Extra Large": "rgba(4, 109, 4, ", // Darkest shade

        "BBQ Chicken Pizza - Small": "rgba(255, 159, 64, ", // Original color
        "BBQ Chicken Pizza - Medium": "rgba(235, 139, 54, ", // Darker shade
        "BBQ Chicken Pizza - Large": "rgba(215, 119, 44, ", // Even darker
        "BBQ Chicken Pizza - Extra Large": "rgba(195, 99, 34, ", // Darkest shade

        "Buffalo Chicken Pizza - Small": "rgba(255, 99, 71, ", // Original color
        "Buffalo Chicken Pizza - Medium": "rgba(235, 89, 61, ", // Darker shade
        "Buffalo Chicken Pizza - Large": "rgba(215, 79, 51, ", // Even darker
        "Buffalo Chicken Pizza - Extra Large": "rgba(195, 69, 41, ", // Darkest shade

        "Sicilian Pizza - Small": "rgba(123, 40, 238, ", // Original color
        "Sicilian Pizza - Medium": "rgba(113, 30, 228, ", // Darker shade
        "Sicilian Pizza - Large": "rgba(103, 20, 218, ", // Even darker
        "Sicilian Pizza - Extra Large": "rgba(93, 10, 208, ", // Darkest shade

        "Oxtail Pizza - Small": "rgba(153, 102, 255, ", // Original color
        "Oxtail Pizza - Medium": "rgba(133, 82, 235, ", // Darker shade
        "Oxtail Pizza - Large": "rgba(113, 62, 215, ", // Even darker
        "Oxtail Pizza - Extra Large": "rgba(93, 42, 195, " // Darkest shade
    };
    // Get the base color from the palette
    let baseColor = colorPalette[datasetLabel] || defaultColor; // Default color if label not found

    baseColor = darkenColor(baseColor, 40);
    // Set opacity if the if it is for the border color
    if (opacity === 'border') {
        baseColor = baseColor + '1)';

    } else {
        if (chartType == 'line') {
            baseColor = baseColor + '1)';
        } else {
            baseColor = baseColor + '0.3)';
        }
    }

    return baseColor;
}


// Helper function to generate random colors
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


// Function to darken a given RGBA color
function darkenColor(rgbaColor, amount) {
    // Extract the RGBA components
    const rgba = rgbaColor.match(/\d+/g).map(Number);
    const r = Math.max(rgba[0] - amount, 0);
    const g = Math.max(rgba[1] - amount, 0);
    const b = Math.max(rgba[2] - amount, 0);
    return `rgba(${r}, ${g}, ${b}, `;
}



// flatten a nested json file into a simple table
function flattenData(data) {
    let flattenedData = [];

    data.forEach(item => {
        // Identify the keys for parent data and nested data
        const keys = Object.keys(item);
        const nestedKey = keys.find(key => Array.isArray(item[key]));
        const parentKeys = keys.filter(key => key !== nestedKey);

        if (nestedKey) {
            const parentValues = parentKeys.reduce((obj, key) => {
                obj[key] = item[key];
                return obj;
            }, {});

            item[nestedKey].forEach(childItem => {
                let flattenedItem = { ...parentValues, ...childItem };
                flattenedData.push(flattenedItem);
            });
        } else {
            flattenedData.push(item);
        }
    });

    return flattenedData;
}


// Group a flat json file by one of the column 
function groupBy(jsonData, groupByKeyIndex) {
    // Ensure the index is within the range of the keys
    if (groupByKeyIndex < 0 || groupByKeyIndex >= Object.keys(jsonData[0]).length) {
        throw new Error('Invalid groupByKeyIndex');
    }

    // Initialize an empty array to store grouped data
    let groupedArray = [];

    // Initialize an empty object to temporarily store grouped data
    let tempGroupedData = {};

    // Iterate through each object in the JSON data
    jsonData.forEach(item => {
        // Get the keys and values of the object
        let keys = Object.keys(item);
        let values = Object.values(item);

        // Extract the key to group by and the remaining keys
        let groupByKey = keys[groupByKeyIndex];
        let remainingKeys = keys.filter((key, index) => index !== groupByKeyIndex);
        let remainingValues = values.filter((value, index) => index !== groupByKeyIndex);

        // If the groupByKey value is not yet in tempGroupedData, initialize it as an empty array
        if (!tempGroupedData[item[groupByKey]]) {
            tempGroupedData[item[groupByKey]] = [];
        }

        // Push an object with the remaining keys and values into the tempGroupedData array
        let groupedObject = {};
        remainingKeys.forEach((key, index) => {
            groupedObject[key] = remainingValues[index];
        });
        tempGroupedData[item[groupByKey]].push(groupedObject);
    });

    // Convert tempGroupedData object into an array of objects
    for (let key in tempGroupedData) {
        let groupByKey = Object.keys(tempGroupedData)[0]; // Fetch the groupByKey dynamically
        groupedArray.push({ [groupByKey]: key, data: tempGroupedData[key] });
    }

    return groupedArray;
}



function createHeatMap(jsonData, chartID) {
    const ctx = document.getElementById(chartID).getContext('2d');

    // Convert the JSON data to the format required by the matrix plugin
    const heatmapData = jsonData.map(obj => ({
        x: obj.x,
        y: obj.y,
        v: parseInt(obj.v, 10)  // Parse v as an integer
    }));

    const minValue = Math.min(...jsonData.map(obj => parseInt(obj.v, 10)));
    const maxValue = Math.max(...jsonData.map(obj => parseInt(obj.v, 10)));
    const hightestTransparency = 0.1*(maxValue - minValue);

    const data = {
        datasets: [{
            label: 'Heatmap Dataset',
            data: heatmapData,
            backgroundColor(ctx) {
                const value = ctx.dataset.data[ctx.dataIndex].v;
                const alpha = (hightestTransparency+value - minValue) / (hightestTransparency+maxValue - minValue);
                return `rgba(34, 139, 34, ${alpha})`;
            },
            borderColor(ctx) {
                const value = ctx.dataset.data[ctx.dataIndex].v;
                const alpha = (hightestTransparency+value - minValue) / (hightestTransparency+maxValue - minValue);
                return `rgba(44, 149, 44, ${alpha})`;
            },
            borderWidth: 1,
            width: ctx => ctx.chart.scales.x.getPixelForTick(1) - ctx.chart.scales.x.getPixelForTick(0) - 1,
            height: ctx => ctx.chart.scales.y.getPixelForTick(1) - ctx.chart.scales.y.getPixelForTick(0) - 1
        }]
    };

    const options = {
        layout: {
            padding: {
                right: 20 // Adjust the padding to provide space for x-axis labels
            }
        },
        scales: {
            x: {
                type: 'category',
                labels: [...new Set(heatmapData.map(item => item.x))] // Get unique x labels from heatmapData
            },
            y: {
                type: 'category',
                labels: [...new Set(heatmapData.map(item => item.y))], // Get unique y labels from heatmapData
                offset: true
            }
        },
        plugins: {
            legend: {
                display: false  // Hide the legend
            },
            tooltip: {
                callbacks: {
                    title() {
                        return '';
                    },
                    label(context) {
                        const v = context.dataset.data[context.dataIndex];
                        return ['x: ' + v.x, 'y: ' + v.y, 'v: ' + v.v];
                    }
                }
            }
        },
    };

    new Chart(ctx, {
        type: 'matrix',
        data: data,
        options: options
    });
}

// Function to get the top 4 objects with the biggest 'v' values, ignoring duplicates
function getTop4Unique(data, topAmount) {
    // Parse 'v' as a number for comparison
    data.forEach(item => item.v = parseInt(item.v, 10));

    // Sort the array in descending order based on 'v'
    data.sort((a, b) => b.v - a.v);

    // Use a Set to keep track of unique 'Pizza 1' values
    const uniqueSet = new Set();
    const top4 = [];

    // Loop through the sorted array and pick top 4 unique items
    for (const item of data) {
        if (!uniqueSet.has(item.v)) {
            uniqueSet.add(item.v);
            top4.push(item);
        }
        if (top4.length === topAmount) {
            break;
        }
    }

    // Map the objects to the new format
    const top4Mapped = top4.map(item => ({
        "Pizza 1": item.x,
        "Pizza 2": item.y,
        "Pair sold": item.v
    }));

    return top4Mapped;
}

// Function to adjust 'v' values where 'x' is the same as 'y'
function adjustDiagonal(data) {
    data.forEach(item => {
        if (item.x === item.y) {
            item.v = (parseInt(item.v, 10) / 2).toString();
        }
    });
}