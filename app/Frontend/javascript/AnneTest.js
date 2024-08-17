$(document).ready(function () {
    var revenueChart;
    var pizzaSoldChart;
    var periodRevenueChart;
    var periodPizzaSalesChart;

    $('#storeDropdown').change(function () {
        fetchStoreInfo();
        fetchRevenueData();
        fetchPizzasSoldData();
        fetchPeriodRevenueData();
        fetchPeriodPizzaSalesData();
        fetchCustomers();
    });

    $('#view, #year').change(function () {
        fetchRevenueData();
        fetchPizzasSoldData();
    });

    $('#periodView, #month, #threeMonthsPeriod, #sixMonthsPeriod').change(function () {
        fetchPeriodRevenueData();
        fetchPeriodPizzaSalesData();
    });

    $('#customerDropdown').change(function () {
        fetchCustomerOrdersInfo();
    });

    function fetchRevenueData() {
        var view = $('#view').val();
        var year = $('#year').val();
        var storeID = $('#storeDropdown').val();

        updateTableHeader(view);

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

    function fetchPizzasSoldData() {
        var view = $('#view').val();
        var year = $('#year').val();
        var storeID = $('#storeDropdown').val();

        updateTableHeader(view);

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

    function updatePeriodTableHeader() {
        const periodTableHeader = $('#periodRevenueTable thead');
        periodTableHeader.empty();
        periodTableHeader.append(`
            <tr>
                <th>Store ID</th>
                <th>Year</th>
                <th>Revenue</th>
            </tr>
        `);
    }

    function fetchPeriodRevenueData() {
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

        console.log('fetchPeriodRevenueData:', { storeID, periodType, periodValue });

        updatePeriodTableHeader();

        $.ajax({
            url: '/BackendTestingJabrail/periodenRevenuePerYears.php',
            type: 'POST',
            dataType: 'json',
            data: { storeID: storeID, periodType: periodType, periodValue: periodValue },
            success: function (response) {
                console.log('Period revenue data response:', response); // Log response for debugging
                if (response.success) {
                    const tableBody = $('#periodRevenueTable tbody');
                    tableBody.empty();

                    const data = response.data;
                    let labels = [];
                    let revenues = [];

                    if (data.length > 0) { // Ensure data array is not empty
                        const revenueData = data[0].data; // Get the correct data array
                        revenueData.forEach(function (item) {
                            console.log('Processing item:', item); // Log each item to check its structure
                            const row = $('<tr>');
                            row.append($('<td>').text(storeID)); // Add storeID to each row
                            row.append($('<td>').text(item.year)); // Add year to each row
                            row.append($('<td>').text(item.revenue)); // Add revenue to each row
                            labels.push(item.year);
                            revenues.push(item.revenue);
                            tableBody.append(row);
                        });

                        // Initialize or update chart
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

    function updatePeriodPizzaSalesTableHeader() {
        const periodPizzaSalesTableHeader = $('#periodPizzaSalesTable thead');
        periodPizzaSalesTableHeader.empty();
        periodPizzaSalesTableHeader.append(`
            <tr>
                <th>Store ID</th>
                <th>Year</th>
                <th>Pizza Sales</th>
            </tr>
        `);
    }

    function fetchPeriodPizzaSalesData() {
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

        console.log('fetchPeriodPizzaSalesData:', { storeID, periodType, periodValue });

        updatePeriodPizzaSalesTableHeader();

        $.ajax({
            url: '/BackendTestingJabrail/periodenPizzaSalesPerStore.php',
            type: 'POST',
            dataType: 'json',
            data: { storeID: storeID, periodType: periodType, periodValue: periodValue },
            success: function (response) {
                console.log('Period pizza sales data response:', response); // Log response for debugging
                if (response.success) {
                    const tableBody = $('#periodPizzaSalesTable tbody');
                    tableBody.empty();

                    const data = response.data;
                    let labels = [];
                    let pizzaSales = [];

                    if (data.length > 0) { // Ensure data array is not empty
                        const pizzaSalesData = data[0].data; // Get the correct data array
                        pizzaSalesData.forEach(function (item) {
                            console.log('Processing item:', item); // Log each item to check its structure
                            const row = $('<tr>');
                            row.append($('<td>').text(storeID)); // Add storeID to each row
                            row.append($('<td>').text(item.year)); // Add year to each row
                            row.append($('<td>').text(item.pizzaQuantity)); // Add pizzaQuantity to each row
                            labels.push(item.year);
                            pizzaSales.push(item.pizzaQuantity);
                            tableBody.append(row);
                        });

                        // Initialize or update chart
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

    function fetchStoreInfo() {
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

    function updateTableHeader(view) {
        const revenueTableHeader = $('#additionalTable thead');
        const pizzaSoldTableHeader = $('#pizzaSoldTable thead');
        revenueTableHeader.empty();
        pizzaSoldTableHeader.empty();

        if (view === 'yearView') {
            revenueTableHeader.append(`
                <tr>
                    <th>Store ID</th>
                    <th>Period</th>
                    <th>Revenue</th>
                </tr>
            `);
            pizzaSoldTableHeader.append(`
                <tr>
                    <th>Store ID</th>
                    <th>Period</th>
                    <th>Total Pizzas</th>
                </tr>
            `);
        } else if (view === 'monthView' || view === 'weekView') {
            revenueTableHeader.append(`
                <tr>
                    <th>Store ID</th>
                    <th>Year</th>
                    <th>Period</th>
                    <th>Revenue</th>
                </tr>
            `);
            pizzaSoldTableHeader.append(`
                <tr>
                    <th>Store ID</th>
                    <th>Year</th>
                    <th>Period</th>
                    <th>Total Pizzas</th>
                </tr>
            `);
        } else if (view === 'dayView') {
            revenueTableHeader.append(`
                <tr>
                    <th>Store ID</th>
                    <th>Morning</th>
                    <th>Lunch</th>
                    <th>Evening</th>
                    <th>Night</th>
                </tr>
            `);
            pizzaSoldTableHeader.append(`
                <tr>
                    <th>Store ID</th>
                    <th>Morning</th>
                    <th>Lunch</th>
                    <th>Evening</th>
                    <th>Night</th>
                </tr>
            `);
        }
    }

    function fetchCustomers() {
        var storeID = $('#storeDropdown').val();
        console.log('Fetching customers for store ID:', storeID); // Log store ID for debugging

        $.ajax({
            url: '/BackendTestingJabrail/clientsDropPerStores.php',
            type: 'POST',
            dataType: 'json',
            data: { storeID: storeID },
            success: function (response) {
                console.log('Customer list response:', response); // Log response for debugging
                if (response.success) {
                    const customerDropdown = $('#customerDropdown');
                    customerDropdown.empty();
                    customerDropdown.append('<option value="">Select Customer</option>'); // Default option

                    const customers = response.data;
                    customers.forEach(function (customer) {
                        const option = $('<option>').val(customer.customerID).text(customer.customerID);
                        customerDropdown.append(option);
                    });
                } else {
                    alert('Failed to fetch customers: ' + response.message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error fetching customers:', textStatus, errorThrown); // Log error for debugging
                alert('Error fetching customers');
            }
        });
    }

    function fetchCustomerOrdersInfo() {
        var storeID = $('#storeDropdown').val();
        var customerID = $('#customerDropdown').val();

        if (!customerID) {
            alert('Please select a customer');
            return;
        }

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
                        $('#customerOrdersTable tbody').html('<tr><td colspan="6">No data available</td></tr>');
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
        fetchPeriodRevenueData();
        fetchPeriodPizzaSalesData();
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
        fetchRevenueData();
        fetchPizzasSoldData();
    });

    $('#year').change(function () {
        fetchRevenueData();
        fetchPizzasSoldData();
    });

    $('#customerDropdown').change(function () {
        fetchCustomerOrdersInfo();
    });

    fetchStoreInfo();
    fetchRevenueData();
    fetchPizzasSoldData();
    fetchPeriodRevenueData();
    fetchPeriodPizzaSalesData();
});
