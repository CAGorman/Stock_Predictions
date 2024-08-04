$(document).ready(function() {
    // Function to fetch stock data and update the page
    function fetchStockData(ticker) {
        $.ajax({
            url: '/get_stock_data',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ ticker: ticker }),
            success: function(response) {
                // Clear previous data
                $('#tickers-grid').empty();
                $('#myChart').remove(); // Remove old chart
                
                // Update stock information
                const currentPrice = response.currentPrice;
                
                $('#tickers-grid').append(`
                    <p>Current Price: $${currentPrice.toFixed(2)}</p>
                `);

                // Fetch historical data to display chart
                fetchHistoricalData(ticker);
            },
            error: function(error) {
                console.error('Error fetching stock data:', error);
            }
        });
    }

// Function to fetch historical data and render the chart
function fetchHistoricalData(ticker) {
    $.ajax({
        url: '/get_stock_data',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ ticker: ticker }),
        success: function(response) {
            // Extract the historical data
            const data = response.data; // Adjust based on actual response structure

            // Check if data is an array and has items
            if (Array.isArray(data) && data.length > 0) {
                // Format dates to MM/DD/YYYY
                const formatDate = (dateString) => {
                    const date = new Date(dateString);
                    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
                    const day = date.getDate().toString().padStart(2, '0');
                    const year = date.getFullYear();
                    return `${month}/${day}/${year}`;
                };

                // Prepare data for Chart.js
                const labels = data.map(entry => formatDate(entry.Date)); // Adjust based on actual response
                const prices = data.map(entry => entry.Close); // Adjust based on actual response

                // Create and append the canvas element for Chart.js
                $('#tickers-grid').append('<canvas id="myChart"></canvas>');

                // Render the chart
                new Chart(document.getElementById('myChart').getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Close Price',
                            data: prices,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                beginAtZero: false,
                                title: {
                                    display: true,
                                    text: 'Date'
                                }
                            },
                            y: {
                                beginAtZero: false,
                                title: {
                                    display: true,
                                    text: 'Close Price'
                                }
                            }
                        }
                    }
                });
            } else {
                console.error('Data is not in expected format or is empty');
            }
        },
        error: function(error) {
            console.error('Error fetching historical data:', error);
        }
    });
}

    // Handle form submission
    $('#add-ticker-form').on('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        const ticker = $('#new-ticker').val();
        fetchStockData(ticker);
    });
});