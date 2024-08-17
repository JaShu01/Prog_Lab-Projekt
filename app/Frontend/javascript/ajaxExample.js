$(document).ready(function () {
   
    function fetchData() {
        var view = $('#view').val();
        var mode = $('#mode').val();
        var year = $('#year').val();
        var month = $('#month').val();
        var week = $('#week').val();

    


       
        $('#tablePerTime').empty();
        $('#tablePerStore').empty();

        
        var ready = false
        switch (view) {
            case "completeView":
                $('#year, #month, #week, #timeframeSettingsLabel').hide()
                if (mode) { ready = true };
                break;
            case "yearView":
                $('#year, #timeframeSettingsLabel').show()
                $('#month, #week').hide()
                if (mode && year) { ready = true };
                break;
            case "monthView":
                $('#year, #month, #timeframeSettingsLabel').show()
                $('#week').hide()
                if (mode && year && month) { ready = true };
                break;
            case "weekView":
                $('#year, #week, #timeframeSettingsLabel').show()
                $('#month').hide()
                if (mode && year && week) { ready = true };
                break;
        };


        
        if (ready) {

            $('#loading3').show(); 
            
            $.ajax({
                url: '/BackendTestingJabrail/salesPerHours.php',
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
                       
                        createChart(response.data, 'salesChartPerStorePerMonth', 'line');
                    } else {
                        $('#salesPerStorePerMonth').html('<p>' + response.message + '</p>');
                    }
                },
                error: function (xhr, status, error) {
                    console.log('AJAX Error:', status, error);
                },
                complete: function () {
                    $('#loading3').hide(); 
                }
            });

            $('#loading').show();
            
            $.ajax({
                url: '/ajax/getSalesPerPizza.php',
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
                        
                        displayJsonTable(response.data, "tablePerTime");

                        createChart(response.data, 'salesChart', 'bar');
                    } else {
                        $('#salesPerTime').html('<p>' + response.message + '</p>');
                    }
                },
                error: function (xhr, status, error) {
                    console.log('AJAX Error:', status, error);
                },
                complete: function () {
                    $('#loading').hide(); 
                }
            });

            $('#loading2').show();
            
            $.ajax({
                url: '/ajax/getSalesPerStore.php',
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
                       
                        displayJsonTable(response.data, "tablePerStore");

                        createChart(response.data, 'salesChartPerStore', "bar");
                    } else {
                        $('#salesPerStore').html('<p>' + response.message + '</p>');
                    }
                },
                error: function (xhr, status, error) {
                    console.log('AJAX Error:', status, error);
                },
                complete: function () {
                    $('#loading2').hide(); 
                }
            });


        }
    }
      
    function fetchExtraData() {
        var view = $('#view').val();
        var mode = $('#mode').val();
        var year = $('#year').val();
        var month = $('#month').val();
        var week = $('#week').val();

       
        $('#salesByHourTable tbody').empty();
        $('#distanceTable tbody').empty();
        $('#salesTable tbody').empty();

        
        var ready = false;
        switch (view) {
            case "completeView":
                $('#year, #month, #week, #timeframeSettingsLabel').hide();
                if (mode) { ready = true; }
                break;
            case "yearView":
                $('#year, #timeframeSettingsLabel').show();
                $('#month, #week').hide();
                if (mode && year) { ready = true; }
                break;
            case "monthView":
                $('#year, #month, #timeframeSettingsLabel').show();
                $('#week').hide();
                if (mode && year && month) { ready = true; }
                break;
            case "weekView":
                $('#year, #week, #timeframeSettingsLabel').show();
                $('#month').hide();
                if (mode && year && week) { ready = true; }
                break;
        }

        
        if (ready) {
            $('#loadingDiv5').show();
            $.ajax({
                url: 'BackendTestingJabrail/salesPerHours.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    view: view,
                    mode: mode,
                    year: year,
                    month: month,
                    week: week
                },
                success: function (response) {
                    $('#loadingDiv5').hide();
                    if (response.success) {
                        const tableBody = $('#salesByHourTable tbody');
                        tableBody.empty();
                        const data = response.data;
                        data.forEach(function (interval) {
                            const row = $('<tr>');
                            row.append($('<td>').text(interval.interval));
                            row.append($('<td>').text(interval.totalPizzas));
                            tableBody.append(row);
                        });
                    } else {
                        $('#salesByHourTable tbody').html('<p>' + response.message + '</p>');
                    }
                },
                error: function (xhr, status, error) {
                    $('#loadingDiv5').hide();
                    console.log('AJAX Error:', status, error);
                }
            });

            $('#loadingDiv6').show(); 
            $.ajax({
                url: 'BackendTestingJabrail/storeClientDistance.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    view: view,
                    mode: mode,
                    year: year,
                    month: month,
                    week: week
                },
                success: function (response) {
                    $('#loadingDiv6').hide(); 
                    if (response.success) {
                        const tableBody = $('#distanceTable tbody');
                        tableBody.empty();
                        const data = response.data;
                        data.forEach(function (row) {
                            const tableRow = $('<tr>');
                            tableRow.append($('<td>').text(row.orderID));
                            tableRow.append($('<td>').text(row.customerID));
                            tableRow.append($('<td>').text(row.storeID));
                            tableRow.append($('<td>').text(row.distance));
                            tableBody.append(tableRow);
                        });
                    } else {
                        $('#distanceTable tbody').html('<p>' + response.message + '</p>');
                    }
                },
                error: function (xhr, status, error) {
                    $('#loadingDiv6').hide(); 
                    console.log('AJAX Error:', status, error);
                }
            });

            var filterType = $('#filterType').val();
            $('#loadingDiv7').show(); 
            $.ajax({
                url: '/BackendTestingJabrail/pizzaSalesPerPlacement.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    filterType: filterType
                },
                success: function (response) {
                    $('#loadingDiv7').hide();
                    if (response.success) {
                        const tableBody = $('#salesTable tbody');
                        tableBody.empty(); 
                        const data = response.data;
                        data.forEach(function (row) {
                            const tableRow = $('<tr>');
                            tableRow.append($('<td>').text(row[filterType]));
                            tableRow.append($('<td>').text(row.totalPizzas));
                            tableBody.append(tableRow);
                        });
                    } else {
                        $('#salesTable tbody').html('<p>' + response.message + '</p>');
                    }
                },
                error: function (xhr, status, error) {
                    $('#loadingDiv7').hide(); 
                    console.log('AJAX Error:', status, error);
                }
            });
        }
    }

    function fetchStoreLocations() {
        $('#loadingDiv4').show(); 
        
        $.ajax({
            url: '/BackendTestingJabrail/storeLocationTransfer.php',
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                $('#loadingDiv4').hide(); 
                if (response.success) {
                    const tableBody = $('#storeLocationsTable tbody');
                    tableBody.empty(); 
                    const data = response.data;
                    
                    data.forEach(function (store) {
                        const row = $('<tr>');
                        row.append($('<td>').text(store.storeID));
                        row.append($('<td>').text(store.zipcode));
                        row.append($('<td>').text(store.state_abbr));
                        row.append($('<td>').text(store.latitude));
                        row.append($('<td>').text(store.longitude));
                        row.append($('<td>').text(store.city));
                        row.append($('<td>').text(store.state));
                        row.append($('<td>').text(store.distance));
                        tableBody.append(row);
                    });
                } else {
                    $('#storeLocationsTable tbody').html('<p>' + response.message + '</p>');
                }
            },
            error: function (xhr, status, error) {
                $('#loadingDiv4').hide(); 
                console.log('AJAX Error:', status, error);
            }
        })
    }
        // Function to fetch store count within a given range
    function fetchStoreCountInRange() {
        var minLatitude = $('#minLatitude').val();
        var maxLatitude = $('#maxLatitude').val();
        var minLongitude = $('#minLongitude').val();
        var maxLongitude = $('#maxLongitude').val();

        $.ajax({
            url: '/BackendTestingJabrail/getStoreCountInRange.php',
            type: 'POST',
            data: {
                minLatitude: minLatitude,
                maxLatitude: maxLatitude,
                minLongitude: minLongitude,
                maxLongitude: maxLongitude
            },
            success: function (response) {
                if (response.success) {
                    $('#storeCount').text(response.data[0].store_count);
                } else {
                    $('#storeCountResult').text('<p>' + response.message + '</p>');
                }
            },
            error: function (xhr, status, error) {
                console.log('AJAX Error:', status, error);
                $('#storeCountResult').text('AJAX error occurred.');
            }
        });
    }
    

    // Trigger fetchData when any dropdown value changes
    $('#view, #mode, #year, #month, #week, #endDate, #startDate, #timeframeType').change(fetchData);
    $('#filterType').change(fetchExtraData);
    $('#findStoresBtn').click(fetchStoreCountInRange);

    // Trigger fetchData when the page loads
    fetchData();
    fetchStoreLocations();
    fetchExtraData(); 
    fetchStoreCountInRange(); 
});