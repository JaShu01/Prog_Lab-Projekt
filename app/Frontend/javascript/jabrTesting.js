$(document).ready(function () {
    // Функция для получения данных о магазине
    function StoreInformation() {
        $('#loading').show();

        const storeID = $('#storeDropdown').val();
        // Запрос в пхп файл
        $.ajax({
            url: '/BackendTestingJabrail/storeLocationTransfer.php',
            type: 'POST',
            dataType: 'json',
            //отправка данных из дропдауна
            data: { storeID: storeID },
            success: function (response) {
                $('#loading').hide();
                if (response.success) {
                    const tableBody = $('#storeTable tbody');
                    tableBody.empty();
                    //заполнение таблицы
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
                $('#storeTable tbody').html('<tr><td colspan="8">Err</td></tr>');
            }
        });
    }
    //срабатывание функций при выборе магаза
    $('#storeDropdown').change(function () {
        StoreInformation();
        RevenueInormation();
        PizzasSoldInfromation();
        CustomersInformation();
    });
    //для динамического обновления таблиц колонок
    function updateTableHeader(view) {
        const revenueTable = $('#additionalTable thead');
        const pizzaSoldTable = $('#pizzaSoldTable thead');
        revenueTable.empty();
        pizzaSoldTable.empty();

        if (view === 'yearView') {
            revenueTable.append(`
                <tr>
                    <th>Store ID</th>
                    <th>Period</th>
                    <th>Revenue</th>
                </tr>
            `);
            pizzaSoldTable.append(`
                <tr>
                    <th>Store ID</th>
                    <th>Period</th>
                    <th>Total Pizzas</th>
                </tr>
            `);
        } else if (view === 'monthView' || view === 'weekView') {
            revenueTable.append(`
                <tr>
                    <th>Store ID</th>
                    <th>Year</th>
                    <th>Period</th>
                    <th>Revenue</th>
                </tr>
            `);
            pizzaSoldTable.append(`
                <tr>
                    <th>Store ID</th>
                    <th>Year</th>
                    <th>Period</th>
                    <th>Total Pizzas</th>
                </tr>
            `);
        } else if (view === 'dayView') {
            revenueTable.append(`
                <tr>
                    <th>Store ID</th>
                    <th>Morning</th>
                    <th>Lunch</th>
                    <th>Evening</th>
                    <th>Night</th>
                </tr>
            `);
            pizzaSoldTable.append(`
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
     //функция для получения данных о продажах
    function RevenueInormation() {
        //сбор даннхы нужых для отправки
        var view = $('#view').val();
        var year = $('#year').val();
        var storeID = $('#storeDropdown').val();
        //вызывает функция подстройки таблицы под данные
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
                    //такое же заполнение
                    const data = response.data;
                    data.forEach(function (item) {
                        item.data.forEach(function (entry) {
                            const row = $('<tr>');
                            if (view === 'yearView') {
                                row.append($('<td>').text(item.storeID));
                                row.append($('<td>').text(entry.period));
                                row.append($('<td>').text(entry.revenue));
                            } else if (view === 'monthView' || view === 'weekView') {
                                row.append($('<td>').text(item.storeID));
                                row.append($('<td>').text(entry.year));
                                row.append($('<td>').text(entry.period));
                                row.append($('<td>').text(entry.revenue));
                            } else if (view === 'dayView') {
                                row.append($('<td>').text(item.storeID));
                                row.append($('<td>').text(entry.Morning));
                                row.append($('<td>').text(entry.Lunch));
                                row.append($('<td>').text(entry.Evening));
                                row.append($('<td>').text(entry.Night));
                            }
                            tableBody.append(row);
                        });
                    });
                } else {
                    $('#additionalTable tbody').html('<tr><td colspan="4">' + response.message + '</td></tr>');
                }
            },
            error: function () {
                $('#additionalTable tbody').html('<tr><td colspan="4">Err</td></tr>');
            }
        });
    }
    //фунция о продажах пиццы
    //отслаьонй фунционал похож
    function PizzasSoldInfromation() {
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
                    data.forEach(function (item) {
                        item.data.forEach(function (entry) {
                            const row = $('<tr>');
                            if (view === 'yearView') {
                                row.append($('<td>').text(item.storeID));
                                row.append($('<td>').text(entry.period));
                                row.append($('<td>').text(entry.totalPizzas));
                            } else if (view === 'monthView' || view === 'weekView') {
                                row.append($('<td>').text(item.storeID));
                                row.append($('<td>').text(entry.year));
                                row.append($('<td>').text(entry.period));
                                row.append($('<td>').text(entry.totalPizzas));
                            } else if (view === 'dayView') {
                                row.append($('<td>').text(item.storeID));
                                row.append($('<td>').text(entry.Morning));
                                row.append($('<td>').text(entry.Lunch));
                                row.append($('<td>').text(entry.Evening));
                                row.append($('<td>').text(entry.Night));
                            }
                            tableBody.append(row);
                        });
                    });
                } else {
                    $('#pizzaSoldTable tbody').html('<tr><td colspan="4">' + response.message + '</td></tr>');
                }
            },
            error: function () {
                $('#pizzaSoldTable tbody').html('<tr><td colspan="4">Error fetching data</td></tr>');
            }
        });
    }
     //также обновление таблицы
    function updatePeriodTableHeader() {
        const periodTablу = $('#periodRevenueTable thead');
        periodTablу.empty();
        periodTablу.append(`
            <tr>
                <th>Store ID</th>
                <th>Year</th>
                <th>Revenue</th>
            </tr>
        `);
    }
    //получения данных о продажах но уже в периоды
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
    
        console.log('fetchPeriodRevenueData:', { storeID, periodType, periodValue });
    
        updatePeriodTableHeader();
    
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
                    if (data.length > 0) { 
                        const revenueData = data[0].data; 
                        revenueData.forEach(function (item) {
                            console.log('Processing item:', item); 
                            const row = $('<tr>');
                            row.append($('<td>').text(storeID)); 
                            row.append($('<td>').text(item.year)); 
                            row.append($('<td>').text(item.revenue));
                            tableBody.append(row);
                        });
                    } else {
                        $('#periodRevenueTable tbody').html('<tr><td colspan="3">No view</td></tr>');
                    }
                } else {
                    $('#periodRevenueTable tbody').html('<tr><td colspan="3">' + response.message + '</td></tr>');
                }
            },
            error: function () {
                $('#periodRevenueTable tbody').html('<tr><td colspan="3">Err</td></tr>');
            }
        });
    }

    //тоже обновление таблицы 
        function updatePeriodPizzaSalesTableHeader() {
            const periodPizzaSalesTabl = $('#periodPizzaSalesTable thead');
            periodPizzaSalesTabl.empty();
            periodPizzaSalesTabl.append(`
                <tr>
                    <th>Store ID</th>
                    <th>Year</th>
                    <th>Pizza Sales</th>
                </tr>
            `);
        }

        //тоже самые пиоды толко пицца
        function PeriodPizzaSalesInformation() {
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
                    console.log('Period pizza sales data response:', response); 
                    if (response.success) {
                        const tableBody = $('#periodPizzaSalesTable tbody');
                        tableBody.empty();
        
                        const data = response.data;
                        if (data.length > 0) { 
                            const pizzaSalesData = data[0].data; 
                            pizzaSalesData.forEach(function (item) {
                                console.log('Processing item:', item); 
                                const row = $('<tr>');
                                row.append($('<td>').text(storeID)); 
                                row.append($('<td>').text(item.year)); 
                                row.append($('<td>').text(item.pizzaQuantity)); 
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
                    $('#periodPizzaSalesTable tbody').html('<tr><td colspan="3">Err</td></tr>');
                }
            });
        }
        //инфа о клиентах 
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
                        alert('Failed to fetch customers: ' + response.message);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error('Err', textStatus, errorThrown);
                    alert('Err');
                }
            });
        }
        
        // инфа о заказах клиентов
        function CustomerOrdersInformation() {
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
                    $('#customerOrdersTable tbody').html('<tr><td colspan="6">Err</td></tr>');
                }
            });
        }
        //расстояние от клинта до магазина , есть еще функци с заданием дистанции
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
                        tableBody.html('<tr><td colspan="3">' + (response.message || 'No da') + '</td></tr>');
                    }
                },
                error: function() {
                    $('#customerStoresTable tbody').html('<tr><td colspan="3">Error</td></tr>');
                }
            });
        }
        //траты клиентов
        function CustomerSpentInformatio() {
            var customerID = $('#customerDropdown').val();
            
            if (!customerID) {
                alert('Please select a customer');
                return;
            }
        
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
                        tableBody.html('<tr><td colspan="6">' + (response.message || 'No вфеф') + '</td></tr>');
                    }
                },
                error: function() {
                    $('#customerSpentTable tbody').html('<tr><td colspan="6">Error </td></tr>');
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

    // Включение вызова fetchData при изменении view
    $('#view').change(function () {
        fetchData();
        RevenueInormation();
        PizzasSoldInfromation();
    });

    // Включение вызова fetchData при изменении года
    $('#year').change(function () {
        RevenueInormation();
        PizzasSoldInfromation();
    });
    


   

    $('#view').change(function () {
        RevenueInormation();
        PizzasSoldInfromation();
    });

    $('#year').change(function () {
        RevenueInormation();
        PizzasSoldInfromation();
    });
    $('#customerDropdown').change(function () {
        CustomerOrdersInformation();
        CustomerSpentInformatio();
    });
    
    $('#customerDropdown, #viewDropdown, #distance').change(CustomerStoreInformation);


    StoreInformation();
    RevenueInormation();
    PizzasSoldInfromation();
    PeriodRevenueInformation();
    PeriodPizzaSalesInformation();
    

});