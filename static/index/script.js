$(document).ready(function() {
    // Function for fetching stock data and update the page
    function fetchStockData(ticker) {
        $.ajax({
            url: '/get_stock_data',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ ticker: ticker }),
            success: function(response) {
                console.log("Stock data response:", response); // Debugging
                // Clearing previous data
                $('#tickers-grid').empty();
                $('#news-section').empty();
             
                // Updating stock information
                const currentPrice = response.currentPrice;
                $('#tickers-grid').append(`
                    <p>Current Price: $${currentPrice.toFixed(2)}</p>
                `);
    
                // Fetching historical data to display chart and news data 
                fetchHistoricalData(ticker);
                fetchStockNews(ticker);
            },
            error: function(error) {
                console.error('Error fetching stock data:', error);
            }
        });

        // Fetching the stock prediction data
        $.ajax({
            url: `/model-endpoint/${ticker}`,
            method: 'GET',
            success: function(response) {
                console.log('Response data:', response); // Checking the received data
        
                if (response && response.predicted_price !== undefined && response.direction !== undefined) {
                    $('#prediction-container').empty().append(`
                        <p>Predicted Price: $${response.predicted_price.toFixed(2)}</p>
                        <p>${response.direction}</p>
                    `);
        
                    $('#predictions').removeClass('up down');
                    if (response.direction.includes('up')) {
                        $('#predictions').addClass('up');
                    } else {
                        $('#predictions').addClass('down');
                    }
                } else {
                    $('#prediction-container').text('No prediction data available.');
                }
            }
        });}
        
    let priceChart = null;
    let volumeChart = null; 
    let averageChart = null;
    let returnsChart = null;

    // Function to fetch historical data and render the chart
    function fetchHistoricalData(ticker) {
        $.ajax({
            url: '/get_stock_data',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ ticker: ticker }),
            success: function(response) {
                const data = response.data; // Adjust based on actual response structure
                 console.log(ticker)
                if (Array.isArray(data) && data.length > 0) {
                    const formatDate = (dateString) => {
                        const date = new Date(dateString);
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        const day = date.getDate().toString().padStart(2, '0');
                        const year = date.getFullYear();
                        return `${month}/${day}/${year}`;
                    };

                    const labels = data.map(entry => formatDate(entry.Date));
                    const prices = data.map(entry => entry.Close);
                    const volumes = data.map(entry => entry.Volume);
                    const movingAverage = prices.map((price, index, arr) => {
                        if (index < 9) return null;
                        return arr.slice(index - 9, index + 1).reduce((a, b) => a + b, 0) / 10;
                    }).filter(val => val !== null);
                    const returns = data.map((entry, index) => {
                        if (index === 0) return null;
                        return (prices[index] - prices[index - 1]) / prices[index - 1];
                    }).filter(val => val !== null);

                    //destroy func to remove chart canvases 

                    if (priceChart){priceChart.destroy()}
                    // Initialize charts
                    priceChart = new Chart(document.getElementById('priceChart').getContext('2d'), {
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
                                x: { beginAtZero: false, title: { display: true, text: 'Date' } },
                                y: { beginAtZero: false, title: { display: true, text: 'Close Price' } }
                            }
                        }
                    });
                    if (volumeChart){volumeChart.destroy()}
                    volumeChart = new Chart(document.getElementById('volumeChart').getContext('2d'), {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'Volume',
                                data: volumes,
                                borderColor: 'rgba(153, 102, 255, 1)',
                                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            scales: {
                                x: { beginAtZero: false, title: { display: true, text: 'Date' } },
                                y: { beginAtZero: true, title: { display: true, text: 'Volume' } }
                            }
                        }
                    });
                    if (averageChart){averageChart.destroy()}
                    averageChart = new Chart(document.getElementById('movingAverageChart').getContext('2d'), {
                        type: 'line',
                        data: {
                            labels: labels.slice(9),
                            datasets: [{
                                label: '10-day Moving Average',
                                data: movingAverage,
                                borderColor: 'rgba(255, 159, 64, 1)',
                                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            scales: {
                                x: { beginAtZero: false, title: { display: true, text: 'Date' } },
                                y: { beginAtZero: false, title: { display: true, text: 'Price' } }
                            }
                        }
                    });
                    if (returnsChart){returnsChart.destroy()}
                    returnsChart = new Chart(document.getElementById('returnsChart').getContext('2d'), {
                        type: 'line',
                        data: {
                            labels: labels.slice(1),
                            datasets: [{
                                label: 'Returns',
                                data: returns,
                                borderColor: 'rgba(255, 99, 132, 1)',
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            scales: {
                                x: { beginAtZero: false, title: { display: true, text: 'Date' } },
                                y: { beginAtZero: false, title: { display: true, text: 'Returns' } }
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
    
    function fetchStockNews(ticker) {
        $.ajax({
            url: '/get_stock_news',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ ticker: ticker }),
            success: function(response) {
                $('#news-section').empty();
                if (Array.isArray(response) && response.length > 0) {
                    response.forEach(newsItem => {
                        // Check if the thumbnail and its resolutions are defined
                        const thumbnailUrl = (newsItem.thumbnail && newsItem.thumbnail.resolutions && newsItem.thumbnail.resolutions[1] && newsItem.thumbnail.resolutions[1].url) 
                            ? newsItem.thumbnail.resolutions[1].url 
                            : 'default-thumbnail.jpg'; // Fallback image URL
    
                        $('#news-section').append(`
                            <div class="news-item">
                                <a href="${newsItem.link}" target="_blank">
                                    <img src="${thumbnailUrl}" alt="${newsItem.title}" />
                                    <h3>${newsItem.title}</h3>
                                    <p>${newsItem.publisher}</p>
                                </a>
                            </div>
                        `);
                    });
                } else {
                    $('#news-section').append('<p>No news available.</p>');
                }
            },
            error: function(error) {
                console.error('Error fetching stock news:', error);
            }
        });
    }

    document.getElementById("add-ticker-form").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way
    
        // Get the ticker symbol from the input field
        const ticker = document.getElementById("new-ticker").value;
    
        // Make an AJAX request to the Flask endpoint
        $.ajax({
            url: `/model-endpoint/${ticker}`,
            type: 'GET',
            success: function(response) {
                // Display the prediction result in the #predictions section
                document.querySelector("#predictions .search-bar").innerHTML = `<p>${response[0]}</p>`;
            },
            error: function(error) {
                console.log("Error:", error);
            }
        });
    });
    
    $('#add-ticker-form').on('submit', function(event) {
        event.preventDefault();
        const ticker = $('#new-ticker').val();
        fetchStockData(ticker);
    });
});