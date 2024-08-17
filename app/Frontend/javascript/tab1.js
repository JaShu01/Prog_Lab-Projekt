$(document).ready(function () {

    //diplay option graph

    $('#bigGraph').hide();

    $('#graph1And2').show();

    $('#graph3And4').hide();
    $('#graph3AndMap').show();
    $('#graphFromRow3').show();
    


    $('#over-view').show();
    $('#storeInfoNew').hide();
    $('#jabrailFunctions').hide();



    $('#chartType1, #chartType2, #chartType3, #chartType4, #chartType5, #stacked').hide();
    $('#grouping1, #grouping2, #grouping3, #grouping4, #grouping5').hide();
    $('#perSize').hide()



    //choose file to load and set the tilte
    var ajaxFile2 = 'getSalesPerTimeframe';
    document.getElementById('graphTitle1').textContent = 'Sales during chosen time frame';

    var ajaxFile3 = 'getSalesPerStore';
    document.getElementById('graphTitle2').textContent = 'Sales per store during the chosen time frame';

    var ajaxFile4 = 'getSalesPerPizza';
    document.getElementById('graphTitle3').textContent = 'Pizza Sales';


    var ajaxFile5 = 'getStoreInfo';
    document.getElementById('graphTitle4').textContent = 'Map of Store and Customers';


    // Function to fetch and display data
    function fetchData() {
        var view = $('#view').val();
        var mode = $('#mode').val();
        var year = $('#year').val();
        var month = $('#month').val();
        var week = $('#week').val();
        var toggle_percent = $('#stores-sold-toggle').val();


        // empty the table of previous value each time a dropdown gets changed
        $('#table4').empty();

        // check view, show/hide relevant dropdowns and check if the relevant dropdown are set 
        var ready = false
        switch (view) {
            case "completeView":
                $('#yearWithLabel, #monthWithLabel, #weekWithLabel, #timeframeSettingsLabel').hide()
                if (mode) { ready = true };
                break;
            case "yearView":
                $('#yearWithLabel, #timeframeSettingsLabel').show()
                $('#monthWithLabel, #weekWithLabel').hide()
                if (mode && year) { ready = true };
                break;
            case "monthView":
                $('#yearWithLabel, #monthWithLabel, #timeframeSettingsLabel').show()
                $('#weekWithLabel').hide()
                if (mode && year && month) { ready = true };
                break;
            case "weekView":
                $('#yearWithLabel, #weekWithLabel, #timeframeSettingsLabel').show()
                $('#monthWithLabel').hide()
                if (mode && year && week) { ready = true };
                break;
        };


        // if all the relevant data is set, the function continues to make ajax request
        if (ready) {
            // Stacking-Bar-Chart
            $('#loading-stacking-barchart').show();
            $.ajax({
                url: '../ajax/getSalesPerPizza.php',
                type: 'POST',
                data: {
                    view: view,
                    mode: mode,
                    year: year,
                    month: month,
                    week: week,
                    perSize: true
                },
                success: function (response) {
                    if (response.success) {
                        stackedBarChart(response.data);
                    } else {
                        $('#chart-container').html('<p>' + response.message + '</p>');
                    }
                },
                error: function (xhr, status, error) {
                    console.log('AJAX Error:', status, error);
                },
                complete: function () {
                    $('#loading-stacking-barchart').hide();
                }
            });
            fetchDataGraph2();
            fetchDataGraph3();
            fetchDataGraph4();
            fetchDataGraph5();
        }
    }


    function fetchDataGraph2() {

        // Abort previous call if it isn't finished yet
        if (currentAjaxRequest2) {
            currentAjaxRequest2.abort();
        }

        // Remove previous chart
        var canvas = document.getElementById('graphCanvas1');
        var ctx = canvas.getContext('2d');

        // Get the chart instance associated with the canvas
        var chartInstance = Chart.getChart(ctx);

        // Check if the chart instance exists and destroy it if it does
        if (chartInstance) {
            chartInstance.destroy();
        }

        var view = $('#view').val();
        var mode = $('#mode').val();
        var year = $('#year').val();
        var month = $('#month').val();
        var week = $('#week').val();
        var perSize = $('#perSize').val();
        var grouping = $('#grouping2').val();
        var chartType = $('#chartType2').val();
        var storeSelection = $('#storeSelection').val();

        $('#graphLoading1').show(); // Show loading indicator for first table
        // ajax request for the first data
        currentAjaxRequest2 = $.ajax({
            url: '/ajax/' + ajaxFile2 + '.php',
            type: 'POST',
            data: {
                view: view,
                mode: mode,
                year: year,
                month: month,
                week: week,
                perSize: perSize,
                storeSelection: storeSelection
            },
            success: function (response) {
                if (response.success) {
                    // Call the functions from to display the table and the chart
                    createChart(response.data, 'graphCanvas1', chartType, grouping);
                } else {
                    $('#graphCanvas1').html('<p>' + response.message + '</p>');
                }
            },
            error: function (xhr, status, error) {
                console.log('AJAX Error:', status, error);
            },
            complete: function () {
                $('#graphLoading1').hide(); // Hide loading indicator when request is complete
            }
        });

    }

    function fetchDataGraph3() {

        // Abort previous call if it isn't finished yet
        if (currentAjaxRequest3) {
            currentAjaxRequest3.abort();
        }

        // Remove previous chart
        var canvas = document.getElementById('graphCanvas2');
        var ctx = canvas.getContext('2d');

        // Get the chart instance associated with the canvas
        var chartInstance = Chart.getChart(ctx);

        // Check if the chart instance exists and destroy it if it does
        if (chartInstance) {
            chartInstance.destroy();
        }

        var view = $('#view').val();
        var mode = $('#mode').val();
        var year = $('#year').val();
        var month = $('#month').val();
        var week = $('#week').val();
        var perSize = $('#perSize').val();
        var grouping = $('#grouping3').val();
        var chartType = $('#chartType3').val();
        var storeSelection = $('#storeSelection').val();

        $('#graphLoading2').show(); // Show loading indicator for first table
        // ajax request for the first data
        currentAjaxRequest3 = $.ajax({
            url: '/ajax/' + ajaxFile3 + '.php',
            type: 'POST',
            data: {
                view: view,
                mode: mode,
                year: year,
                month: month,
                week: week,
                perSize: perSize,
                storeSelection: storeSelection
            },
            success: function (response) {
                if (response.success) {
                    // Call the functions from to display the table and the chart
                    createChart(response.data, 'graphCanvas2', chartType, grouping);
                } else {
                    $('#graphCanvas2').html('<p>' + response.message + '</p>');
                }
            },
            error: function (xhr, status, error) {
                console.log('AJAX Error:', status, error);
            },
            complete: function () {
                $('#graphLoading2').hide(); // Hide loading indicator when request is complete
            }
        });
    }

    function fetchDataGraph4() {

        // Abort previous call if it isn't finished yet
        if (currentAjaxRequest4) {
            currentAjaxRequest4.abort();
        }

        // Remove previous chart
        var canvas = document.getElementById('graphCanvas3');
        var ctx = canvas.getContext('2d');

        // Get the chart instance associated with the canvas
        var chartInstance = Chart.getChart(ctx);

        // Check if the chart instance exists and destroy it if it does
        if (chartInstance) {
            chartInstance.destroy();
        }

        var view = $('#view').val();
        var mode = $('#mode').val();
        var year = $('#year').val();
        var month = $('#month').val();
        var week = $('#week').val();
        var perSize = $('#perSize').val();
        var grouping = $('#grouping4').val();
        var chartType = $('#chartType4').val();
        var storeSelection = $('#storeSelection').val();


        $('#loading-pie-chart-pizza').show(); // Show loading indicator for second table 
        // ajax request for the first data
        currentAjaxRequest4 = $.ajax({
            url: '/ajax/' + ajaxFile4 + '.php',
            type: 'POST',
            data: {
                view: view,
                mode: mode,
                year: year,
                month: month,
                week: week,
                perSize: true,
                storeSelection: storeSelection

            },
            success: function (response) {
                if (response.success) {
                    // Call the functions from to display the table and the chart
                    pieChartStores(response.data);

                } else {
                    $('#graphCanvas3').html('<p>' + response.message + '</p>');
                }
            },
            error: function (xhr, status, error) {
                console.log('AJAX Error:', status, error);
            },
            complete: function () {
                $('#loading-pie-chart-pizza').hide(); // Hide loading indicator when request is complete
            }
        });
    }

    function fetchDataGraph5() {

        // Abort previous call if it isn't finished yet
        if (currentAjaxRequest5) {
            currentAjaxRequest5.abort();
        }

        // Remove previous chart
        var canvas = document.getElementById('graphCanvas4');
        var ctx = canvas.getContext('2d');

        // Get the chart instance associated with the canvas
        var chartInstance = Chart.getChart(ctx);

        // Check if the chart instance exists and destroy it if it does
        if (chartInstance) {
            chartInstance.destroy();
        }

        var view = $('#view').val();
        var mode = $('#mode').val();
        var year = $('#year').val();
        var month = $('#month').val();
        var week = $('#week').val();
        var perSize = $('#perSize').val();
        var grouping = $('#grouping5').val();
        var chartType = $('#chartType5').val();
        var storeSelection = $('#storeSelection').val();


        $('#loading-map').show(); // Show loading indicator for second table 
        // AJAX request for the second data
        currentAjaxRequest5 = $.ajax({
            url: '/ajax/' + ajaxFile5 + '.php',
            type: 'POST',
            data: {
                view: view,
                mode: mode,
                year: year,
                month: month,
                week: week,
                storeSelection: storeSelection
            },
            success: function (response) {
                if (response.success) {
                    // Call the function from showTable.js
                    mapStores(response.data);
                } else {
                    $('#graphCanvas4').html('<p>' + response.message + '</p>');
                }
            },
            error: function (xhr, status, error) {
                console.log('AJAX Error:', status, error);
            },
            complete: function () {
                $('#loading-map').hide(); // Hide loading indicator when request is complete
            }
        });
    }

    // a map function that shows all stores on a map with their store ID and distance from the main store
    function mapStores(data) {
        var map = L.map('map').setView([40, -120], 4.5);
        const stores = [];

        var keys = Object.keys(data[0]);
        var storeID = keys[0];
        var latitude = 'latitude';
        var longitude = 'longitude';
        var city = 'city';

        data.forEach(store => {
            stores.push({
                lat: parseFloat(store[latitude]),
                lng: parseFloat(store[longitude]),
                name: store[storeID],
                city: store[city]
            });
        });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // var stores = [
        //     { lat: 41.328852, lng: -116.12251, name: 'Tuscarora', StoreID: 'S490972'},
        //     { lat: 37.593883, lng: -121.88281, name: 'Sunol', StoreID: 'S476770' }
        // ];

        stores.forEach(store => {
            L.marker([store.lat, store.lng]).addTo(map)
                .bindPopup(`<b>${store.city}</b><br>Store ID: ${store.name}`)
                .openPopup();
        });
    }


// Showing the total Sales in a given timeframe
    function lineChartSales(data) {

        var keys = Object.keys(data[0]);
        var storeID = keys[0];
        var storeValue = keys[1];

        var storeNames = data.map(item => item[storeID]);
        var storeValues = data.map(item => item[storeValue]);

        const overAllSold = echarts.init(document.getElementById('line-chart-sales'));

        var existingChart = echarts.getInstanceByDom(overAllSold);
        if (existingChart) {
            echarts.dispose(existingChart);
        }
        if (document.getElementById('data-display').value === 'units') {
            var yAxisLabel = 'Units Sold in Thousands';
        } else {
            var yAxisLabel = 'Revenue in Thousands';
        }
        if (document.getElementById('sold-time').value === 'weekView') {
            var xAxisLabel = 'Week Days';
        } else if (document.getElementById('sold-time').value === 'monthView') {
            var xAxisLabel = 'Month in Days';
        } else {
            var xAxisLabel = 'Year in Months';
        }
        var option = {
            title: {
                text: 'Sales Data'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '6%',
                right: '2%',
                bottom: '5%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: storeNames,
                name: xAxisLabel,
                nameLocation: 'middle',
                nameGap: 25,
                nameTextStyle: {
                    fontSize: 16
                }
            },
            yAxis: {
                type: 'value',
                name: yAxisLabel,
                nameTextStyle: {
                    fontSize: 16
                },
            },
            series: [{
                name: 'Sales',
                type: 'line',
                data: storeValues,
                itemStyle: {
                    color: 'rgba(75, 192, 192, 0.8)'
                }
            }]
        };

        overAllSold.setOption(option);
        option && overAllSold.setOption(option);
        overAllSold.resize({width: 1000, height: 400})

    }

// Showing the total Sales/Revenue for each store in the selected time frame
    function storesValueBarChart(data) {
        var keys = Object.keys(data[0]);
        var storeID = keys[0];
        var storeValue = keys[1];


        const sortedBarchartStores = echarts.init(document.getElementById('stores-sold-barchart'));

        var existingChart = echarts.getInstanceByDom(sortedBarchartStores);
        if (existingChart) {
            echarts.dispose(existingChart);
        }

        var storeDataWithStoreID = data.map(item => ({
            value: item[storeValue],
            category: item[storeID]
        }));

        storeDataWithStoreID.sort((a, b) => b.value - a.value);

        var sortedStoreData = storeDataWithStoreID.map(item => item.value);
        var sortedStoreID = storeDataWithStoreID.map(item => item.category);

        if (document.getElementById('data-display').value === 'units') {
            var yAxisLabel = 'Units Sold in Thousands';
        } else {
            var yAxisLabel = 'Revenue in Thousands';
        }
        var option = {
            title: {
                text: 'Sales Data'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '8%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: sortedStoreID,
                name: 'Store Names',
                nameLocation: 'middle',
                nameGap: 50,
                nameTextStyle: {
                    fontSize: 16
                },
                axisLabel: {
                    formatter: '{value}',
                    rotate: 45
                },
            },
            yAxis: {
                type: 'value',
                name: yAxisLabel,
                nameTextStyle: {
                    fontSize: 16
                },
                axisLabel: {
                    formatter: '{value}',
                    rotate: 45
                }
            },
            series: [{
                name: 'Sales',
                type: 'bar',
                data: sortedStoreData,
                itemStyle: {
                    color: 'rgba(75, 192, 192, 0.8)'
                }
            }]
        };

        option && sortedBarchartStores.setOption(option);
        sortedBarchartStores.resize({width: 1000, height: 500})
    }

// Showing the percentage of total Sales/Revenue for each store in comparison to the total sales in the selected time frame
    function storesPercentBarChart(data) {
        var keys = Object.keys(data[0]);
        var storeData = keys[0];
        var storeID = keys[1];

        const sortedBarchartStores = echarts.init(document.getElementById('stores-sold-barchart'));

        var existingChart = echarts.getInstanceByDom(sortedBarchartStores);
        if (existingChart) {
            echarts.dispose(existingChart);
        }

        var storeDataWithStoreID = data.map(item => ({
            value: item[storeID],
            category: item[storeData]
        }));

        storeDataWithStoreID.sort((a, b) => b.value - a.value);

        var totalValue = storeDataWithStoreID.reduce((sum, item) => sum + parseFloat(item.value), 0);

        var sortedStoreData = storeDataWithStoreID.map(item => {
            return parseFloat(((item.value / totalValue) * 100).toFixed(2));
        });

        var sortedStoreID = storeDataWithStoreID.map(item => item.category);

        var yAxisLabel;
        if (document.getElementById('data-display').value === 'units') {
            yAxisLabel = 'Percentage of Units Sold';
        } else {
            yAxisLabel = 'Percentage of Revenue';
        }

        var option = {
            title: {
                text: 'Sales Data'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function (params) {
                    var total = 0;
                    params.forEach(function (item) {
                        total += item.value;
                    });
                    return params[0].name + '<br>' + params.map(function (item) {
                        return item.marker + item.seriesName + ' % : ' + item.value.toFixed(2) + '%';
                    })//.join('<br>') + '<br>Total: ' + total.toFixed(2) + '%';
                }
            },

            grid: {
                left: '8%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: sortedStoreID,
                name: 'Store Names',
                nameLocation: 'middle',
                nameGap: 50,
                nameTextStyle: {
                    fontSize: 16
                },
                axisLabel: {
                    formatter: '{value}',
                    rotate: 45
                },
            },
            yAxis: {
                type: 'value',
                name: yAxisLabel,
                nameLocation: 'end',
                nameGap: 10,
                nameTextStyle: {
                    fontSize: 16
                },
                axisLabel: {
                    formatter: '{value}%',
                    rotate: 45,
                    padding: [0, 20, 0, 0]
                }
            },
            series: [{
                name: 'Sales',
                type: 'bar',
                data: sortedStoreData,
                itemStyle: {
                    color: 'rgba(75, 192, 192, 0.8)'
                }
            }]
        };

        sortedBarchartStores.setOption(option);
        sortedBarchartStores.resize({width: 1000, height: 500});
    }

    // A Stacking Bar Chart visualizing the percentage of sales for each store together with Pizzas Ordered
    function stackedBarChart(data) {
        const barChart = echarts.init(document.getElementById('stacking-barchart-pizza'));
    
        // Extract unique pizza sizes and names
        const pizzaSizes = [...new Set(data.flatMap(pizza => pizza.data.map(item => item.pizzaSize)))];
        const pizzaNames = data.map(pizza => pizza.pizzaName);
    
        // Color map for sizes
        const colorMap = {
            "Extra Large": '#4e79a7',
            "Large": '#59a14f',
            "Medium": '#edc949',
            "Small": '#e15759'
        };
    
        const series = pizzaSizes.map(size => ({
            name: size,
            type: 'bar',
            stack: 'total',
            label: {
                show: true,
                position: 'inside',
                formatter: '{c}'
            },
            emphasis: {
                focus: 'series'
            },
            data: data.map(pizza => {
                const sizeData = pizza.data.find(item => item.pizzaSize === size);
                return sizeData ? parseInt(sizeData.unitsSold) : 0;
            }),
            itemStyle: {
                color: colorMap[size] || '#808080'
            }
        }));
    
        const option = {
            title: {
                text: 'Pizza Sales by Size',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: pizzaSizes,
                top: '5%'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: pizzaNames
            },
            yAxis: {
                type: 'value'
            },
            series: series
        };
    
        barChart.setOption(option);
        barChart.resize({width: 1000, height: 500});
    }

    function pieChartStores(data) {
        const pieChart = echarts.init(document.getElementById('pie-chart'));

        const processedData = data.map(pizza => ({
            name: pizza.pizzaName,
            value: pizza.data.reduce((sum, size) => sum + parseInt(size.unitsSold), 0)
        }));

        processedData.sort((a, b) => b.value - a.value);

        const colorMap = {
            "Margherita Pizza": 'rgba(255, 99, 132)',
            "Pepperoni Pizza": "rgba(54, 130, 235)",
            "Hawaiian Pizza": "rgba(255, 206, 86)",
            "Meat Lover's Pizza": "rgba(75, 192, 192)",
            "Veggie Pizza": "rgba(34, 139, 34)",
            "BBQ Chicken Pizza": "rgba(255, 159, 64)",
            "Buffalo Chicken Pizza": "rgba(255, 99, 71)",
            "Sicilian Pizza": "rgba(123, 40, 238)",
            "Oxtail Pizza": "rgba(153, 102, 255)",
        };
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                top: '5%',
                left: 'center'
            },
            series: [
                {
                    name: 'Pizza Sales',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 20,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: processedData.map(item => ({
                        ...item,
                        itemStyle: {
                            color: colorMap[item.name] || '#808080'
                        }
                    }))
                }
            ]
        };

        pieChart.setOption(option);
        pieChart.resize({width: 500, height: 500});
    }

// a map function that shows all stores on a map with their store ID and distance from the main store
    function mapStores(data) {
        var map = L.map('map').setView([40, -120], 4.5);
        const stores = [];

        var keys = Object.keys(data[0]);
        var storeID = keys[0];
        var latitude = 'latitude';
        var longitude = 'longitude';
        var city = 'city';

        data.forEach(store => {
            stores.push({
                lat: parseFloat(store.latitude),
                lng: parseFloat(store.longitude),
                name: store.storeID,
                city: store.city
            });
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        stores.forEach(store => {
            L.marker([store.lat, store.lng]).addTo(map)
                .bindPopup(`<b>${store.city}</b><br>Store ID: ${store.name}`)
                .openPopup();
        });
    }





    // Trigger fetchData when any dropdown value changes
    $('#view, #mode, #year, #month, #week, #endDate, #startDate, #timeframeType, #storeSelection').change(fetchData);
    //$('#chartType1, #grouping1').change(fetchDataGraph1);
    $('#chartType2, #grouping2').change(fetchDataGraph2);
    $('#chartType3, #grouping3').change(fetchDataGraph3);
    $('#chartType4, #grouping4').change(fetchDataGraph4);
    $('#chartType5, #grouping5').change(fetchDataGraph5);

    // Trigger fetchData when the page loads
    fetchData();
});