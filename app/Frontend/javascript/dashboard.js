// function loadScript(scriptUrl) {
//     // Remove any existing script element
//     const existingScript = document.getElementById('dynamicScript');
//     if (existingScript) {
//         existingScript.remove();
//     }

//     // Create a new script element
//     const script = document.createElement('script');
//     script.src = scriptUrl;
//     script.id = 'dynamicScript';
//     document.body.appendChild(script);
// }

// loadScript('assets/js/jgTesting1.js');

// // Set up event listeners for buttons
// document.getElementById('loadJs1').addEventListener('click', () => loadScript('assets/js/jgTesting1.js'));
// document.getElementById('loadJs2').addEventListener('click', () => loadScript('assets/js/jgTesting2.js'));
// document.getElementById('loadJs3').addEventListener('click', () => loadScript('assets/js/jgTesting3.js'));

// declare the upcoming request so that they can be canceled and replaced
var currentAjaxRequest1 = null;
var currentAjaxRequest2 = null;
var currentAjaxRequest3 = null;
var currentAjaxRequest4 = null;
var currentAjaxRequest5 = null;

function loadTab(jsFile, tabElement) {
    // Remove 'selected' class from all tabs
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('selected'));
    
    // Add 'selected' class to the clicked tab
    tabElement.classList.add('selected');
    
    // Create a script element
    const script = document.createElement('script');
    script.src = jsFile;
    
    // Remove any existing script elements
    document.querySelectorAll('script[data-dynamic]').forEach(s => s.remove());
    
    // Mark the new script element as dynamic
    script.setAttribute('data-dynamic', 'true');
    
    // Append the new script to the body
    document.body.appendChild(script);
}



// Load the default tab (first tab) on page load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.tab').click();
});


// function to open and close the sidebar
function openSideBar() {
    document.getElementById("sidebar").style.width = "40%";
}

function closeSideBar() {
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