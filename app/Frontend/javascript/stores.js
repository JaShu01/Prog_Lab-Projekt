$(document).ready(function () {
    var revenueChart;
    var pizzaSoldChart;
    var periodRevenueChart;
    var periodPizzaSalesChart;
    var map;
    var marker;

    function initializeMap() {
        map = L.map('map').setView([0, 0], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    }

    function updateMap(latitude, longitude) {
        if (marker) {
            map.removeLayer(marker); // Remove existing marker
        }

        marker = L.marker([latitude, longitude]).addTo(map);
        map.setView([latitude, longitude], 13); 
    }

    $('#storeDropdown').change(function () {
        StoreInformation();
        RevenueInformation();
        PizzasSoldInformation();
        PeriodRevenueInformation();
        PeriodPizzaSalesInformation();
        CustomersInformation();
    });

    $('#view, #year').change(function () {
        RevenueInformation();
        PizzasSoldInformation();
    });

    $('#periodView, #month, #threeMonthsPeriod, #sixMonthsPeriod').change(function () {
        PeriodRevenueInformation();
        PeriodPizzaSalesInformation();
    });

    $('#customerDropdown').change(function () {
        CustomerOrderInformation();
    });

    function RevenueInformation() {
        var view = $('#view').val();
        var year = $('#year').val();
        var storeID = $('#storeDropdown').val();

        

        $.ajax({
            url: '/BackendTestingJabrail/revenuePerStore.php',
            type: 'POST',
            dataType: 'json',
            data: { storeID: storeID, view: view, year: year },
            success: function (response) {
                if (response.success) {
                    const tableBody = $('#additionalTable tbody');
                    tableBody.empty();

                    const data = response.data;
                    let labels = [];
                    let revenues = [];

                    data.forEach(function (item) {
                        item.data.forEach(function (entry) {
                            const row = $('<tr>');
                            if (view === 'yearView') {
                                row.append($('<td>').text(item.storeID));
                                row.append($('<td>').text(entry.period));
                                row.append($('<td>').text(entry.revenue));
                                labels.push(entry.period);
                                revenues.push(entry.revenue);
                            } else if (view === 'monthView' || view === 'weekView') {
                                row.append($('<td>').text(item.storeID));
                                row.append($('<td>').text(entry.year));
                                row.append($('<td>').text(entry.period));
                                row.append($('<td>').text(entry.revenue));
                                labels.push(`${entry.year} ${entry.period}`);
                                revenues.push(entry.revenue);
                            } else if (view === 'dayView') {
                                row.append($('<td>').text(item.storeID));
                                row.append($('<td>').text(entry.Morning));
                                row.append($('<td>').text(entry.Lunch));
                                row.append($('<td>').text(entry.Evening));
                                row.append($('<td>').text(entry.Night));
                                labels.push('Morning', 'Lunch', 'Evening', 'Night');
                                revenues.push(entry.Morning, entry.Lunch, entry.Evening, entry.Night);
                            }
                            tableBody.append(row);
                        });
                    });

                    // Initialize or update chart
                    if (revenueChart) {
                        revenueChart.data.labels = labels;
                        revenueChart.data.datasets[0].data = revenues;
                        revenueChart.update();
                    } else {
                        var ctx1 = document.getElementById('revenueChart').getContext('2d');
                        revenueChart = new Chart(ctx1, {
                            type: 'line',
                            data: {
                                labels: labels,
                                datasets: [{
                                    label: 'Revenue',
                                    data: revenues,
                                    borderColor: 'blue',
                                    backgroundColor: 'lightblue',
                                    fill: false
                                }]
                            }
                        });
                    }
                } else {
                    $('#additionalTable tbody').html('<tr><td colspan="4">' + response.message + '</td></tr>');
                }
            },
            error: function () {
                $('#additionalTable tbody').html('<tr><td colspan="4">Error fetching data</td></tr>');
            }
        });
    }

    function PizzasSoldInformation() {
        var view = $('#view').val();
        var year = $('#year').val();
        var storeID = $('#storeDropdown').val();

        

        $.ajax({
            url: '/BackendTestingJabrail/pizzaSalesPerStore.php',
            type: 'POST',
            dataType: 'json',
            data: { storeID: storeID, view: view, year: year },
            success: function (response) {
                if (response.success) {
                    const tableBody = $('#pizzaSoldTable tbody');
                    tableBody.empty();

                    const data = response.data;
                    let labels = [];
                    let pizzasSold = [];

                    data.forEach(function (item) {
                        item.data.forEach(function (entry) {
                            const row = $('<tr>');
                            if (view === 'yearView') {
                                row.append($('<td>').text(item.storeID));
                                row.append($('<td>').text(entry.period));
                                row.append($('<td>').text(entry.totalPizzas));
                                labels.push(entry.period);
                                pizzasSold.push(entry.totalPizzas);
                            } else if (view === 'monthView' || view === 'weekView') {
                                row.append($('<td>').text(item.storeID));
                                row.append($('<td>').text(entry.year));
                                row.append($('<td>').text(entry.period));
                                row.append($('<td>').text(entry.totalPizzas));
                                labels.push(`${entry.year} ${entry.period}`);
                                pizzasSold.push(entry.totalPizzas);
                            } else if (view === 'dayView') {
                                row.append($('<td>').text(item.storeID));
                                row.append($('<td>').text(entry.Morning));
                                row.append($('<td>').text(entry.Lunch));
                                row.append($('<td>').text(entry.Evening));
                                row.append($('<td>').text(entry.Night));
                                labels.push('Morning', 'Lunch', 'Evening', 'Night');
                                pizzasSold.push(entry.Morning, entry.Lunch, entry.Evening, entry.Night);
                            }
                            tableBody.append(row);
                        });
                    });

                    // Initialize or update chart
                    if (pizzaSoldChart) {
                        pizzaSoldChart.data.labels = labels;
                        pizzaSoldChart.data.datasets[0].data = pizzasSold;
                        pizzaSoldChart.update();
                    } else {
                        var ctx2 = document.getElementById('pizzaSoldChart').getContext('2d');
                        pizzaSoldChart = new Chart(ctx2, {
                            type: 'bar',
                            data: {
                                labels: labels,
                                datasets: [{
                                    label: 'Pizzas Sold',
                                    data: pizzasSold,
                                    backgroundColor: 'orange'
                                }]
                            }
                        });
                    }
                } else {
                    $('#pizzaSoldTable tbody').html('<tr><td colspan="4">' + response.message + '</td></tr>');
                }
            },
            error: function () {
                $('#pizzaSoldTable tbody').html('<tr><td colspan="4">Error fetching data</td></tr>');
            }
        });
    }

    

    function PeriodRevenueInformation() {
        var periodType = $('#periodView').val();
        var storeID = $('#storeDropdown').val();
        var periodValue = null;

        if (periodType === 'oneMonth') {
            periodValue = $('#month').val();
        } else if (periodType === 'threeMonths') {
            periodValue = $('#threeMonthsPeriod').val();
        } else if (periodType === 'sixMonths') {
            periodValue = $('#sixMonthsPeriod').val();
        }

        

        

        $.ajax({
            url: '/BackendTestingJabrail/periodenRevenuePerYears.php',
            type: 'POST',
            dataType: 'json',
            data: { storeID: storeID, periodType: periodType, periodValue: periodValue },
            success: function (response) {
                
                if (response.success) {
                    const tableBody = $('#periodRevenueTable tbody');
                    tableBody.empty();

                    const data = response.data;
                    let labels = [];
                    let revenues = [];

                    if (data.length > 0) { 
                        const revenueData = data[0].data; 
                        revenueData.forEach(function (item) {
                            console.log('Processing item:', item); 
                            const row = $('<tr>');
                            row.append($('<td>').text(storeID)); 
                            row.append($('<td>').text(item.year)); 
                            row.append($('<td>').text(item.revenue)); 
                            labels.push(item.year);
                            revenues.push(item.revenue);
                            tableBody.append(row);
                        });

                        
                        if (periodRevenueChart) {
                            periodRevenueChart.data.labels = labels;
                            periodRevenueChart.data.datasets[0].data = revenues;
                            periodRevenueChart.update();
                        } else {
                            var ctx3 = document.getElementById('periodRevenueChart').getContext('2d');
                            periodRevenueChart = new Chart(ctx3, {
                                type: 'line',
                                data: {
                                    labels: labels,
                                    datasets: [{
                                        label: 'Period Revenue',
                                        data: revenues,
                                        borderColor: 'green',
                                        backgroundColor: 'lightgreen',
                                        fill: false
                                    }]
                                }
                            });
                        }
                    } else {
                        $('#periodRevenueTable tbody').html('<tr><td colspan="3">No view</td></tr>');
                    }
                } else {
                    $('#periodRevenueTable tbody').html('<tr><td colspan="3">' + response.message + '</td></tr>');
                }
            },
            error: function () {
                $('#periodRevenueTable tbody').html('<tr><td colspan="3">Error fetching data</td></tr>');
            }
        });
    }

   

    function PeriodPizzaSalesInformation() {
        var periodView = $('#periodView').val();
        var storeID = $('#storeDropdown').val();
        var periodChoose = null;

        if (periodView === 'oneMonth') {
            periodChoose = $('#month').val();
        } else if (periodView === 'threeMonths') {
            periodChoose = $('#threeMonthsPeriod').val();
        } else if (periodView === 'sixMonths') {
            periodChoose = $('#sixMonthsPeriod').val();
        }

        

        

        $.ajax({
            url: '/BackendTestingJabrail/periodenPizzaSalesPerStore.php',
            type: 'POST',
            dataType: 'json',
            data: { storeID: storeID, periodType: periodView, periodValue: periodChoose },
            success: function (response) {
               
                if (response.success) {
                    const tableBody = $('#periodPizzaSalesTable tbody');
                    tableBody.empty();

                    const data = response.data;
                    let labels = [];
                    let pizzaSales = [];

                    if (data.length > 0) { 
                        const pizzaSalesData = data[0].data; 
                        pizzaSalesData.forEach(function (item) {
                            console.log('Processing item:', item); 
                            const row = $('<tr>');
                            row.append($('<td>').text(storeID)); 
                            row.append($('<td>').text(item.year)); 
                            row.append($('<td>').text(item.pizzaQuantity)); 
                            labels.push(item.year);
                            pizzaSales.push(item.pizzaQuantity);
                            tableBody.append(row);
                        });

                        
                        if (periodPizzaSalesChart) {
                            periodPizzaSalesChart.data.labels = labels;
                            periodPizzaSalesChart.data.datasets[0].data = pizzaSales;
                            periodPizzaSalesChart.update();
                        } else {
                            var ctx4 = document.getElementById('periodPizzaSalesChart').getContext('2d');
                            periodPizzaSalesChart = new Chart(ctx4, {
                                type: 'bar',
                                data: {
                                    labels: labels,
                                    datasets: [{
                                        label: 'Period Pizza Sales',
                                        data: pizzaSales,
                                        backgroundColor: 'purple'
                                    }]
                                }
                            });
                        }
                    } else {
                        $('#periodPizzaSalesTable tbody').html('<tr><td colspan="3">No view</td></tr>');
                    }
                } else {
                    $('#periodPizzaSalesTable tbody').html('<tr><td colspan="3">' + response.message + '</td></tr>');
                }
            },
            error: function () {
                $('#periodPizzaSalesTable tbody').html('<tr><td colspan="3">Error fetching data</td></tr>');
            }
        });
    }

    function StoreInformation() {
        $('#loading').show();

        const storeID = $('#storeDropdown').val();

        $.ajax({
            url: '/BackendTestingJabrail/storeLocationTransfer.php',
            type: 'POST',
            dataType: 'json',
            data: { storeID: storeID },
            success: function (response) {
                $('#loading').hide();
                if (response.success) {
                    const tableBody = $('#storeTable tbody');
                    tableBody.empty();

                    const data = response.data;
                    data.forEach(function (store) {
                        const row = $('<tr>');
                        row.append($('<td>').text(store.storeID));
                        row.append($('<td>').text(store.zipcode));
                        row.append($('<td>').text(store.stateAbbr));
                        row.append($('<td>').text(store.latitude));
                        row.append($('<td>').text(store.longitude));
                        row.append($('<td>').text(store.city));
                        row.append($('<td>').text(store.stateFull));
                        row.append($('<td>').text(store.distance));
                        tableBody.append(row);

                        // Update map with the store location
                        updateMap(store.latitude, store.longitude);
                    });
                } else {
                    $('#storeTable tbody').html('<tr><td colspan="8">' + response.message + '</td></tr>');
                }
            },
            error: function () {
                $('#loading').hide();
                $('#storeTable tbody').html('<tr><td colspan="8">Error fetching data</td></tr>');
            }
        });
    }

    

    function CustomersInformation() {
        var storeID = $('#storeDropdown').val();
        

        $.ajax({
            url: '/BackendTestingJabrail/clientsDropPerStores.php',
            type: 'POST',
            dataType: 'json',
            data: { storeID: storeID },
            success: function (response) {
                console.log('Customer list response:', response); 
                if (response.success) {
                    const customerDropdown = $('#customerDropdown');
                    customerDropdown.empty();
                    customerDropdown.append('<option value="">Select Customer</option>'); 

                    const customers = response.data;
                    customers.forEach(function (customer) {
                        const option = $('<option>').val(customer.customerID).text(customer.customerID);
                        customerDropdown.append(option);
                    });
                } else {
                    alert('Failed: ' + response.message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error :', textStatus, errorThrown); 
                alert('Error');
            }
        });
    }

    function CustomerOrderInformation() {
        var storeID = $('#storeDropdown').val();
        var customerID = $('#customerDropdown').val();

       

        $.ajax({
            url: '/BackendTestingJabrail/customersDataPerStores.php',
            type: 'POST',
            dataType: 'json',
            data: { storeID: storeID, customerID: customerID },
            success: function (response) {
                console.log('Customer orders info response:', response);
                if (response.success) {
                    const tableBody = $('#customerOrdersTable tbody');
                    tableBody.empty();

                    const data = response.data;
                    if (data && data.length > 0) {
                        data.forEach(function (item) {
                            const customerID = item.customerID;
                            if (item.data && item.data.length > 0) {
                                item.data.forEach(function (entry) {
                                    console.log('Processing entry:', entry);
                                    const row = $('<tr>');
                                    row.append($('<td>').text(customerID));
                                    row.append($('<td>').text(entry.orderCount));
                                    row.append($('<td>').text(entry.lastOrderDate));
                                    row.append($('<td>').text(entry.mostOrderedProduct));
                                    row.append($('<td>').text(entry.totalSpent));
                                    row.append($('<td>').text(entry.distanceToStore));
                                    tableBody.append(row);
                                });
                            } else {
                                const row = $('<tr>');
                                row.append($('<td>').text(customerID));
                                row.append($('<td>').text('N/A'));
                                row.append($('<td>').text('N/A'));
                                row.append($('<td>').text('N/A'));
                                row.append($('<td>').text('N/A'));
                                row.append($('<td>').text('N/A'));
                                tableBody.append(row);
                            }
                        });
                    } else {
                        $('#customerOrdersTable tbody').html('<tr><td colspan="6">No data a</td></tr>');
                    }
                } else {
                    $('#customerOrdersTable tbody').html('<tr><td colspan="6">' + response.message + '</td></tr>');
                }
            },
            error: function () {
                $('#customerOrdersTable tbody').html('<tr><td colspan="6">Error fetching data</td></tr>');
            }
        });
    }
    function CustomerOrderInformation() {
        var storeID = $('#storeDropdown').val();
        var customerID = $('#customerDropdown').val();
    
       
    
        $.ajax({
            url: '/BackendTestingJabrail/customersDataPerStores.php',
            type: 'POST',
            dataType: 'json',
            data: { storeID: storeID, customerID: customerID },
            success: function (response) {
                
                if (response.success) {
                    const tableBody = $('#customerOrdersTable tbody');
                    tableBody.empty();
    
                    const data = response.data;
                    if (data && data.length > 0) {
                        data.forEach(function (item) {
                            const customerID = item.customerID;
                            if (item.data && item.data.length > 0) {
                                item.data.forEach(function (entry) {
                                    console.log('Processing entry:', entry);
                                    const row = $('<tr>');
                                    row.append($('<td>').text(customerID));
                                    row.append($('<td>').text(entry.orderCount));
                                    row.append($('<td>').text(entry.lastOrderDate));
                                    row.append($('<td>').text(entry.mostOrderedProduct));
                                    row.append($('<td>').text(entry.totalSpent));
                                    row.append($('<td>').text(entry.distanceToStore));
                                    tableBody.append(row);
                                });
                            } else {
                                const row = $('<tr>');
                                row.append($('<td>').text(customerID));
                                row.append($('<td>').text('N/A'));
                                row.append($('<td>').text('N/A'));
                                row.append($('<td>').text('N/A'));
                                row.append($('<td>').text('N/A'));
                                row.append($('<td>').text('N/A'));
                                tableBody.append(row);
                            }
                        });
                    } else {
                        $('#customerOrdersTable tbody').html('<tr><td colspan="6">No data </td></tr>');
                    }
                } else {
                    $('#customerOrdersTable tbody').html('<tr><td colspan="6">' + response.message + '</td></tr>');
                }
            },
            error: function () {
                $('#customerOrdersTable tbody').html('<tr><td colspan="6">Error</td></tr>');
            }
        });
    }
    function CustomerStoreInformation() {
        var customerID = $('#customerDropdown').val();
        var view = $('#viewDropdown').val();
        var distance = $('#distance').val();

        

        var data = { customerID: customerID, view: view };
        if (view === 'storesInArea' && distance) {
            data.distance = distance;
        }

        $.ajax({
            url: '/BackendTestingJabrail/storeClientDistance.php',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function(response) {
                
                const tableBody = $('#customerStoresTable tbody');
                tableBody.empty();

                if (response.success && response.data) {
                    response.data.forEach(function(item) {
                        if (item.data && item.data.length > 0) {
                            item.data.forEach(function(entry) {
                                const row = $('<tr>');
                                row.append($('<td>').text(item.storeID));
                                row.append($('<td>').text(entry.distanceToStore));
                                row.append($('<td>').text(entry.placedOrder));
                                tableBody.append(row);
                            });
                        } else {
                            const row = $('<tr>');
                            row.append($('<td>').text(item.storeID));
                            row.append($('<td>').text('N/A'));
                            row.append($('<td>').text('N/A'));
                            tableBody.append(row);
                        }
                    });
                } else {
                    tableBody.html('<tr><td colspan="3">' + (response.message || 'No data') + '</td></tr>');
                }
            },
            error: function() {
                $('#customerStoresTable tbody').html('<tr><td colspan="3">Error</td></tr>');
            }
        });
    }
    function CustomerSpentInformation() {
        var customerID = $('#customerDropdown').val();
        
       
    
        $.ajax({
            url: '/BackendTestingJabrail/customersSpent.php',
            type: 'POST',
            dataType: 'json',
            data: { customerID: customerID },
            success: function(response) {
                
                const tableBody = $('#customerSpentTable tbody');
                tableBody.empty();
    
                if (response.success && response.data) {
                    response.data.forEach(function(item) {
                        if (item.data && item.data.length > 0) {
                            item.data.forEach(function(entry) {
                                const row = $('<tr>');
                                row.append($('<td>').text(item.customerID));
                                row.append($('<td>').text(entry.orderCount));
                                row.append($('<td>').text(entry.totalItems));
                                row.append($('<td>').text(entry.totalSpent));
                                row.append($('<td>').text(entry.averageItemPrice));
                                row.append($('<td>').text(entry.averageOrderValue));
                                tableBody.append(row);
                            });
                        } else {
                            const row = $('<tr>');
                            row.append($('<td>').text(item.customerID));
                            row.append($('<td>').text('N/A'));
                            row.append($('<td>').text('N/A'));
                            row.append($('<td>').text('N/A'));
                            row.append($('<td>').text('N/A'));
                            row.append($('<td>').text('N/A'));
                            tableBody.append(row);
                        }
                    });
                } else {
                    tableBody.html('<tr><td colspan="6">' + (response.message || 'No dat') + '</td></tr>');
                }
            },
            error: function() {
                $('#customerSpentTable tbody').html('<tr><td colspan="6">Error</td></tr>');
            }
        });
    }

    $('#periodView').change(function () {
        var periodType = $(this).val();
        $('#monthSettings').hide();
        $('#threeMonthsSettings').hide();
        $('#sixMonthsSettings').hide();

        if (periodType === 'oneMonth') {
            $('#monthSettings').show();
        } else if (periodType === 'threeMonths') {
            $('#threeMonthsSettings').show();
        } else if (periodType === 'sixMonths') {
            $('#sixMonthsSettings').show();
        }
    });

    $('#periodView, #month, #threeMonthsPeriod, #sixMonthsPeriod').change(function () {
        PeriodRevenueInformation();
        PeriodPizzaSalesInformation();
    });

    function fetchData(url, tableId) {
        var view = $('#view').val();
        var year = $('#year').val();
        var storeID = $('#storeDropdown').val();

        switch (view) {
            case "yearView":
                $('#timeframeSettings').hide();
                break;
            case "monthView":
            case "weekView":
            case "dayView":
                $('#timeframeSettings').show();
                break;
        }
    }

    $('#view').change(function () {
        fetchData();
        RevenueInformation();
        PizzasSoldInformation();
    });

    $('#year').change(function () {
        RevenueInformation();
        PizzasSoldInformation();
    });

    $('#customerDropdown').change(function () {
        CustomerOrderInformation();
    });

    $('#viewDropdown').change(function() {
        if ($(this).val() === 'storesInArea') {
            $('#distanceInput').show();
        } else {
            $('#distanceInput').hide();
        }
    });
    $('#customerDropdown').change(function () {
        CustomerOrderInformation();
        CustomerSpentInformation();
    });
    
    $('#customerDropdown, #viewDropdown, #distance').change(CustomerStoreInformation);

    initializeMap();
    StoreInformation();
    RevenueInformation();
    PizzasSoldInformation();
    PeriodRevenueInformation();
    PeriodPizzaSalesInformation();
});