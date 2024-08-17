// function needed to interact with the ajax calls and the data from the database
$(document).ready(function () {
    function fetchData() {
        var view = $('#sold-time').val();
        var mode = $('#data-display').val();
        var year = $('#yearDropdown').val();
        var month = $('#monthDropdown').val();
        var week = $('#weekDropdown').val();
        var toggle_percent = $('#stores-sold-toggle').val();
        var pizzaSize = $('#pizza-size').val();

        var ready = false;
        switch (view) {
            case "yearView":
                $('#yearDropdown').show();
                $('#monthDropdown, #weekDropdown').hide();
                if (mode && year) {
                    ready = true;
                }
                break;
            case "monthView":
                $('#yearDropdown, #monthDropdown').show();
                $('#weekDropdown').hide();
                if (mode && year && month) {
                    ready = true;
                }
                break;
            case "weekView":
                $('#yearDropdown, #weekDropdown').show();
                $('#monthDropdown').hide();
                if (mode && year && week) {
                    ready = true;
                }
                break;
        }

        if (ready) {
            // Line-Chart
            $('#loading-line-chart').show();
            $.ajax({
                url: '../ajax/getSalesPerTimeframe.php',
                type: 'POST',
                data: {
                    view: view,
                    mode: mode,
                    year: year,
                    month: month,
                    week: week
                },
                success: function (response) {
                    if (response.success) {
                        lineChartSales(response.data);
                    } else {
                        $('#chart-container').html('<p>' + response.message + '</p>');
                    }
                },
                error: function (xhr, status, error) {
                    console.log('AJAX Error:', status, error);
                },
                complete: function () {
                    $('#loading-line-chart').hide();
                }
            });
            // Store-Bar-Chart
            $('#loading-stores-sold').show();
            $.ajax({
                url: '../ajax/getSalesPerStore.php',
                type: 'POST',
                data: {
                    view: view,
                    mode: mode,
                    year: year,
                    month: month,
                    week: week
                },
                success: function (response) {
                    if (response.success) {
                        if (toggle_percent === 'percent') {
                            storesPercentBarChart(response.data);
                        } else {
                            storesValueBarChart(response.data);
                        }
                    } else {
                        $('#chart-container').html('<p>' + response.message + '</p>');
                    }
                },
                error: function (xhr, status, error) {
                    console.log('AJAX Error:', status, error);
                },
                complete: function () {
                    $('#loading-stores-sold').hide();
                }
            });
            // Store-Bar-Chart2
            $('#loading-bar-no-percent').show();
            $.ajax({
                url: '../ajax/getSalesPerStore.php',
                type: 'POST',
                data: {
                    view: view,
                    mode: mode,
                    year: year,
                    month: month,
                    week: week
                },
                success: function (response) {
                    if (response.success) {
                        if (toggle_percent === 'percent') {
                            storesPercentBarChart(response.data);
                        } else {
                            storesValueBarChart(response.data);
                        }
                    } else {
                        $('#chart-container').html('<p>' + response.message + '</p>');
                    }
                },
                error: function (xhr, status, error) {
                    console.log('AJAX Error:', status, error);
                },
                complete: function () {
                    $('#loading-bar-no-percent').hide();
                }
            });
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
            // Pie-Chart
            $('#loading-pie-chart-pizza').show();
            $.ajax({
                url: '../ajax/getSalesPerPizza.php',
                type: 'POST',
                data: {
                    view: view,
                    mode: mode,
                    year: year,
                    month: month,
                    week: week,
                    perSize: true,
                },
                success: function (response) {
                    if (response.success) {
                        pieChartStores(response.data);
                    } else {
                        $('#chart-container').html('<p>' + response.message + '</p>');
                    }
                },
                error: function (xhr, status, error) {
                    console.log('AJAX Error:', status, error);
                },
                complete: function () {
                    $('#loading-pie-chart-pizza').hide();
                }
            });
            // Map
            $('#loading-map').show();
            $.ajax({
                url: '../ajax/getStoreInfo.php',
                type: 'POST',
                data: {
                    view: view,
                    mode: mode,
                    year: year,
                    month: month,
                    week: week
                },
                success: function (response) {
                    if (response.success) {
                        mapStores(response.data);
                    } else {
                        $('#chart-container').html('<p>' + response.message + '</p>');
                    }
                },
                error: function (xhr, status, error) {
                    console.log('AJAX Error:', status, error);
                },
                complete: function () {
                    $('#loading-map').hide();
                }
            });
            // Sidebar State-Data-Unit-Fix
            $.ajax({
                url: '../ajax/getSalesPerStore.php',
                method: 'Post',
                data: {
                    view: 'completeView',
                },
                success: function(response) {
                    if (response.success) {
                        stateUnitDataFix(response.data);
                    }
                },
                error: function (xhr, status, error) {
                    console.log('AJAX Error:', status, error);
                }
            });
            // Sidebar State-Data-Unit-Change
            $.ajax({
                url: '../ajax/getSalesPerStore.php',
                method: 'Post',
                data: {
                    view: view,
                    mode: mode,
                    year: year,
                    month: month,
                    week: week
                },
                success: function(response) {
                    if (response.success) {
                        stateUnitDataChange(response.data);
                    }
                },
                error: function (xhr, status, error) {
                    console.log('AJAX Error:', status, error);
                }
            });
            // Sidebar State-Data-Revenue-Fix
            $.ajax({
                url: '../ajax/getSalesPerStore.php',
                method: 'Post',
                data: {
                    view: 'completeView',
                },
                success: function(response) {
                    if (response.success) {
                        stateRevenueDataFix(response.data);
                    }
                },
                error: function (xhr, status, error) {
                    console.log('AJAX Error:', status, error);
                }
            });
            // Sidebar State-Data-Revenue-Change
            $.ajax({
                url: '../ajax/getSalesPerStore.php',
                method: 'Post',
                data: {
                    view: view,
                    mode: mode,
                    year: year,
                    month: month,
                    week: week
                },
                success: function(response) {
                    if (response.success) {
                        stateRevenueDataChange(response.data);
                    }
                },
                error: function (xhr, status, error) {
                    console.log('AJAX Error:', status, error);
                }
            });
            // Bump-Chart1
            $('#loading-bump-chart-Pizza').show();
            $.ajax({
                url: '../ajax/getBumpChartPizza.php',
                type: 'POST',
                data: {
                    view: view,
                    mode: mode,
                    year: year,
                    month: month,
                    week: week,
                    storeSelection: 'all'
                },
                success: function (response) {
                    if (response.success) {
                        bumpChartPizzaRanking(response.data);
                    } else {
                        $('#chart-container').html('<p>' + response.message + '</p>');
                    }
                },
                error: function (xhr, status, error) {
                    console.log('AJAX Error:', status, error);
                },
                complete: function () {
                    $('#loading-bump-chart-Pizza').hide();
                }
            });
            // Bump-Chart2
            $('#loading-bump-chart-Store').show();
            $.ajax({
                url: '../ajax/getBumpChartStores.php',
                type: 'POST',
                data: {
                    view: 'completeView',
                    mode: 'units',
                    year: year,
                    month: month,
                    week: week,
                    perSize: false,
                    storeSelection: 'all'
                },
                success: function (response) {
                    if (response.success) {
                        bumpChartStoreRanking(response.data, mode)
                    } else {
                        $('#chart-container').html('<p>' + response.message + '</p>');
                    }
                },
                error: function (xhr, status, error) {
                    console.log('AJAX Error:', status, error);
                },
                complete: function () {
                    $('#loading-bump-chart-Store').hide();
                }
            });
        }
    }

    fetchData();
    $('#updateButton').click(fetchData);

    $('#sold-time').change(function () {
        var view = $(this).val();
        switch (view) {
            case "yearView":
                $('#yearDropdown').show();
                $('#monthDropdown, #monthDropdownTitle, #weekDropdown, #weekDropdownTitle').hide();
                break;
            case "monthView":
                $('#yearDropdown, #monthDropdown, #monthDropdownTitle').show();
                $('#weekDropdown, #weekDropdownTitle').hide();
                break;
            case "weekView":
                $('#yearDropdown, #weekDropdown, #weekDropdownTitle').show();
                $('#monthDropdown, #monthDropdownTitle').hide();
                break;
            default:
                $('#yearDropdown, #monthDropdown, #weekDropdown').hide();
                break;
        }
    }).trigger('change');

});

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

// shows a piechart based the most sold Pizza times (based on size of the pizza, can also show all pizzas)
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

// shows a bump chart of the Top 10 pizza ranked based on the sales
function bumpChartPizzaRanking(data) {
    var myChart = document.getElementById('bump-chart-Pizza');

    // Extract pizza names and years from the data
    const pizzas = data.map(item => item.pizzaName);
    const years = Object.keys(data[0]).filter(key => key !== 'pizzaName');

    // Generate ranking data
    const generateRankingData = () => {
        const map = new Map();
        for (const year of years) {
            const yearSales = pizzas.map(pizza => ({
                pizza: pizza,
                sales: data.find(item => item.pizzaName === pizza)[year]
            }));
            yearSales.sort((a, b) => b.sales - a.sales);
            yearSales.forEach((item, index) => {
                const rank = index + 1;
                map.set(item.pizza, (map.get(item.pizza) || []).concat(rank));
            });
        }
        return map;
    };

    // Generate series list
    const generateSeriesList = () => {
        const seriesList = [];
        const rankingMap = generateRankingData();
        rankingMap.forEach((data, pizza) => {
            const series = {
                name: pizza,
                symbolSize: 20,
                type: 'line',
                smooth: true,
                emphasis: {
                    focus: 'series'
                },
                endLabel: {
                    show: true,
                    formatter: '{a}',
                    distance: 20
                },
                lineStyle: {
                    width: 4
                },
                data: data
            };
            seriesList.push(series);
        });
        return seriesList;
    };

    const option = {
        title: {
            text: 'Pizza Ranking Bump Chart'
        },
        tooltip: {
            trigger: 'item'
        },
        grid: {
            left: 30,
            right: 110,
            bottom: 30,
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            splitLine: {
                show: true
            },
            axisLabel: {
                margin: 30,
                fontSize: 16
            },
            boundaryGap: false,
            data: years
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                margin: 30,
                fontSize: 16,
                formatter: '#{value}'
            },
            inverse: true,
            interval: 1,
            min: 1,
            max: pizzas.length
        },
        series: generateSeriesList()
    };
}

// shows a bump chart of the Top 10 stores ranked based on the sales/toggle between units and revenue
function bumpChartStoreRanking(data) {
    var myChart = document.getElementById('bump-chart-Store');
    var option;
    var storeIds = data.map(store => store.storeID);
    var years = [...new Set(data.flatMap(store => store.data.map(d => d.sellingYear)))].sort();

    const seriesList = data.map(store => {
        const data = years.map(year => {
            const yearData = store.data.find(d => d.sellingYear === year);
            return yearData ? parseInt(yearData.yearlyRank) : null;
        });

        return {
            name: store.storeID,
            symbolSize: 20,
            type: 'line',
            smooth: true,
            emphasis: {
                focus: 'series'
            },
            endLabel: {
                show: true,
                formatter: '{a}',
                distance: 20
            },
            lineStyle: {
                width: 4
            },
            data: data
        };
    });

    option = {
        title: {
            text: 'Store Ranking Bump Chart'
        },
        tooltip: {
            trigger: 'item'
        },
        grid: {
            left: 30,
            right: 110,
            bottom: 30,
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            splitLine: {
                show: true
            },
            axisLabel: {
                margin: 30,
                fontSize: 16
            },
            boundaryGap: false,
            data: years
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                margin: 30,
                fontSize: 16,
                formatter: '#{value}'
            },
            inverse: true,
            interval: 1,
            min: 1,
            max: storeIds.length
        },
        series: seriesList
    };

    option && myChart.setOption(option);
}

// to filter the dropdown list of stores
function filterDropdown() {
    var input, filter, div, a, i;
    input = document.getElementById("dropdownSearch");
    filter = input.value.toUpperCase();
    div = document.getElementsByClassName("dropdown-content")[0];
    a = div.getElementsByTagName("a");

    for (i = 0; i < a.length; i++) {
        if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}

// to go to the store page of the store  that was selected
function navigateToStore(storeId) {
    var storeIDValue = document.getElementById("dropdownSearch")
    storeIDValue.value = storeId;
}

// function to open and close the sidebar
function openSideBar() {
    document.getElementById("sidebar").style.width = "40%";
}

// function to close the sidebar
function closeSideBar(data) {
    document.getElementById("sidebar").style.width = "0";
}

// function to show the Units Sold as fix data of the different states
function stateUnitDataFix(data) {
    const caStores = [
        'S476770', 'S750231', 'S817950', 'S948821', 'S872983',
        'S068548', 'S449313', 'S276746', 'S606312', 'S062214',
        'S361257', 'S918734', 'S048150', 'S370494', 'S216043',
        'S396799', 'S122017'
    ];
    const nvStores = [
        'S490972', 'S799887', 'S013343', 'S263879', 'S064089',
        'S058118', 'S351225', 'S080157', 'S588444', 'S486166',
        'S669665', 'S505400', 'S147185'
    ];
    const utStores = ['S302800'];
    const azStores = ['S688745'];

    var keys = Object.keys(data[0]);
    var storeIDKey = keys[0];
    var unitKey = keys[1];

    let totalUnitsSold = 0;

    let stateData = {
        CA: {units: 0},
        NV: {units: 0},
        UT: {units: 0},
        AZ: {units: 0}
    };

    data.forEach(store => {
        let units = parseInt(store[unitKey]);
        let storeID = store[storeIDKey];

        totalUnitsSold += units;

        if (caStores.includes(storeID)) stateData.CA.units += units;
        else if (nvStores.includes(storeID)) stateData.NV.units += units;
        else if (utStores.includes(storeID)) stateData.UT.units += units;
        else if (azStores.includes(storeID)) stateData.AZ.units += units;
    });
    document.getElementById('totalUnitsFix').innerText = totalUnitsSold;
    document.getElementById('unitsCA').innerText = stateData.CA.units;
    document.getElementById('unitsNV').innerText = stateData.NV.units;
    document.getElementById('unitsUT').innerText = stateData.UT.units;
    document.getElementById('unitsAZ').innerText = stateData.AZ.units;

}

// function to show the Units Sold data of the states that you can change via time
function stateUnitDataChange(data) {
    const caStores = [
        'S476770', 'S750231', 'S817950', 'S948821', 'S872983',
        'S068548', 'S449313', 'S276746', 'S606312', 'S062214',
        'S361257', 'S918734', 'S048150', 'S370494', 'S216043',
        'S396799', 'S122017'
    ];
    const nvStores = [
        'S490972', 'S799887', 'S013343', 'S263879', 'S064089',
        'S058118', 'S351225', 'S080157', 'S588444', 'S486166',
        'S669665', 'S505400', 'S147185'
    ];
    const utStores = ['S302800'];
    const azStores = ['S688745'];

    var keys = Object.keys(data[0]);
    var storeIDKey = keys[0];
    var unitKey = keys[1];

    let totalUnits = 0;

    let stateData = {
        CA: { units: 0 },
        NV: { units: 0 },
        UT: { units: 0 },
        AZ: { units: 0 }
    };

    data.forEach(store => {
        let units = parseInt(store[unitKey]);
        let storeID = store[storeIDKey];

        totalUnits += units;

        if (caStores.includes(storeID)) stateData.CA.units += units;
        else if (nvStores.includes(storeID)) stateData.NV.units += units;
        else if (utStores.includes(storeID)) stateData.UT.units += units;
        else if (azStores.includes(storeID)) stateData.AZ.units += units;
    });
    document.getElementById('totalUnitsChoice').innerText = totalUnits;
    document.getElementById('revenueCA').innerText = stateData.CA.units;
    document.getElementById('revenueNV').innerText = stateData.NV.units;
    document.getElementById('revenueUT').innerText = stateData.UT.units;
    document.getElementById('revenueAZ').innerText = stateData.AZ.units;
}

// function to show the Revenue data of the states as fix data
function stateRevenueDataFix(data) {
    const caStores = [
        'S476770', 'S750231', 'S817950', 'S948821', 'S872983',
        'S068548', 'S449313', 'S276746', 'S606312', 'S062214',
        'S361257', 'S918734', 'S048150', 'S370494', 'S216043',
        'S396799', 'S122017'
    ];
    const nvStores = [
        'S490972', 'S799887', 'S013343', 'S263879', 'S064089',
        'S058118', 'S351225', 'S080157', 'S588444', 'S486166',
        'S669665', 'S505400', 'S147185'
    ];
    const utStores = ['S302800'];
    const azStores = ['S688745'];

    var keys = Object.keys(data[0]);
    var storeIDKey = keys[0];
    var revenueKey = keys[1];


    let totalRevenue = 0;

    let stateData = {
        CA: {unitsSold: 0},
        NV: {unitsSold: 0},
        UT: {unitsSold: 0},
        AZ: {unitsSold: 0}
    };

    data.forEach(store => {
        let revenue = parseInt(store[revenueKey]);
        let storeID = store[storeIDKey];

        totalRevenue += revenue;

        if (caStores.includes(storeID)) stateData.CA.revenue += revenue;
        else if (nvStores.includes(store.storeID)) stateData.NV.revenue += revenue;
        else if (utStores.includes(store.storeID)) stateData.UT.revenue += revenue;
        else if (azStores.includes(store.storeID)) stateData.AZ.revenue += revenue;
    });
    document.getElementById('totalRevenueChoice').innerText = totalRevenue;
    document.getElementById('revenueCA').innerText = stateData.CA.revenue;
    document.getElementById('revenueNV').innerText = stateData.NV.revenue;
    document.getElementById('revenueUT').innerText = stateData.UT.revenue;
    document.getElementById('revenueAZ').innerText = stateData.AZ.revenue;
}

// function to show the Revenue data of the states that you can change via time
function stateRevenueDataChange(data) {
    const caStores = [
        'S476770', 'S750231', 'S817950', 'S948821', 'S872983',
        'S068548', 'S449313', 'S276746', 'S606312', 'S062214',
        'S361257', 'S918734', 'S048150', 'S370494', 'S216043',
        'S396799', 'S122017'
    ];
    const nvStores = [
        'S490972', 'S799887', 'S013343', 'S263879', 'S064089',
        'S058118', 'S351225', 'S080157', 'S588444', 'S486166',
        'S669665', 'S505400', 'S147185'
    ];
    const utStores = ['S302800'];
    const azStores = ['S688745'];

    var keys = Object.keys(data[0]);
    var storeIDKey = keys[0];
    var revenueKey = keys[1];


    let totalRevenue = 0;

    let stateData = {
        CA: {unitsSold: 0},
        NV: {unitsSold: 0},
        UT: {unitsSold: 0},
        AZ: {unitsSold: 0}
    };

    data.forEach(store => {
        let revenue = parseInt(store[revenueKey]);
        let storeID = store[storeIDKey];

        totalRevenue += revenue;

        if (caStores.includes(storeID)) stateData.CA.revenue += revenue;
        else if (nvStores.includes(store.storeID)) stateData.NV.revenue += revenue;
        else if (utStores.includes(store.storeID)) stateData.UT.revenue += revenue;
        else if (azStores.includes(store.storeID)) stateData.AZ.revenue += revenue;
    });
    document.getElementById('totalRevenueChoice').innerText = totalRevenue;
    document.getElementById('revenueCA').innerText = stateData.CA.revenue;
    document.getElementById('revenueNV').innerText = stateData.NV.revenue;
    document.getElementById('revenueUT').innerText = stateData.UT.revenue;
    document.getElementById('revenueAZ').innerText = stateData.AZ.revenue;
}

// Saving the Text in the Note Section as a .txt file
function saveText() {
    const noteText = document.getElementById('noteField').value;

    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10);

    const blob = new Blob([noteText], {type: 'text/plain'});

    const link = document.createElement('a');

    link.download = `note_${formattedDate}.txt`

    link.href = window.URL.createObjectURL(blob);

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
}

// Saving all the graphs as images
function saveGraphs() {
    const charts = document.querySelectorAll('.chart-container');
    charts.forEach((chart, index) => {
        html2canvas(chart, {
            backgroundColor: '#FFFFFF', // Set background color to white
            onrendered: function(canvas) {
                const link = document.createElement('a');
                link.download = `chart_${index + 1}.jpeg`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
        });
    });
}
