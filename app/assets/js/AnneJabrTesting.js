$(document).ready(function () {
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
                    const data = response.data;
                    const labels = data.map(store => store.storeID);
                    const zipcodes = data.map(store => store.zipcode);
                    const states = data.map(store => store.stateAbbr);

                    const ctx = document.getElementById('storeChart').getContext('2d');
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'Zipcode',
                                data: zipcodes,
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1
                            }, {
                                label: 'State',
                                data: states,
                                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                                borderColor: 'rgba(153, 102, 255, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                $('#loading').hide();
                alert('Error fetching data');
            }
        });
    }

    function updateTableHeader(view) {
        // No changes needed here for the chart
    }

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
                    const data = response.data;
                    const labels = data.flatMap(item => item.data.map(entry => entry.period));
                    const revenues = data.flatMap(item => item.data.map(entry => entry.revenue));

                    const ctx = document.getElementById('additionalChart').getContext('2d');
                    new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'Revenue',
                                data: revenues,
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                borderColor: 'rgba(255, 99, 132, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                alert('Error fetching data');
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
                    const data = response.data;
                    const labels = data.flatMap(item => item.data.map(entry => entry.period));
                    const totalPizzas = data.flatMap(item => item.data.map(entry => entry.totalPizzas));

                    const ctx = document.getElementById('pizzaSoldChart').getContext('2d');
                    new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'Total Pizzas',
                                data: totalPizzas,
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                alert('Error fetching data');
            }
        });
    }

    function updatePeriodTableHeader() {
        // No changes needed here for the chart
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

        updatePeriodTableHeader();

        $.ajax({
            url: '/BackendTestingJabrail/periodenRevenuePerYears.php',
            type: 'POST',
            dataType: 'json',
            data: { storeID: storeID, periodType: periodType, periodValue: periodValue },
            success: function (response) {
                if (response.success) {
                    const data = response.data[0].data;
                    const labels = data.map(item => item.year);
                    const revenues = data.map(item => item.revenue);

                    const ctx = document.getElementById('periodRevenueChart').getContext('2d');
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'Revenue',
                                data: revenues,
                                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                                borderColor: 'rgba(255, 206, 86, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                alert('Error fetching data');
            }
        });
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
                    if (data.length > 0) { // Ensure data array is not empty
                        const pizzaSalesData = data[0].data; // Get the correct data array
                        pizzaSalesData.forEach(function (item) {
                            console.log('Processing item:', item); // Log each item to check its structure
                            const row = $('<tr>');
                            row.append($('<td>').text(storeID)); // Add storeID to each row
                            row.append($('<td>').text(item.year)); // Add year to each row
                            row.append($('<td>').text(item.pizzaQuantity)); // Add pizzaQuantity to each row
                            tableBody.append(row);
                        });
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
    function fetchCustomerStoreData() {
        var customerID = $('#customerDropdown').val();
        var view = $('#viewDropdown').val();
        var distance = $('#distance').val();

        if (!customerID) {
            alert('Please select a customer');
            return;
        }

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
                console.log('Customer stores info response:', response);
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
                    tableBody.html('<tr><td colspan="3">' + (response.message || 'No data available') + '</td></tr>');
                }
            },
            error: function() {
                $('#customerStoresTable tbody').html('<tr><td colspan="3">Error fetching data</td></tr>');
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

$('#viewDropdown').change(function() {
    if ($(this).val() === 'storesInArea') {
        $('#distanceInput').show();
    } else {
        $('#distanceInput').hide();
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

    $('#storeDropdown').change(function () {
        fetchStoreInfo();
        fetchRevenueData();
        fetchPizzasSoldData();
        fetchPeriodRevenueData();
    });

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
        fetchPeriodRevenueData();
    });

    $('#view').change(function () {
        fetchRevenueData();
        fetchPizzasSoldData();
    });

    $('#year').change(function () {
        fetchRevenueData();
        fetchPizzasSoldData();
    });

    fetchStoreInfo();
    fetchRevenueData();
    fetchPizzasSoldData();
    fetchPeriodRevenueData();
});