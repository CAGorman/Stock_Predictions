$(document).ready(function() {
    // Function to fetch stock data and update the page
    function fetchStockData(ticker) {
        $.ajax({
            url: '/get_stock_data',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ ticker: ticker }),
            success: function(response) {
                console.log("Stock data response:", response); // Debugging
                // Clear previous data
                $('#tickers-grid').empty();
                $('#news-section').empty();
             
                // Update stock information
                const currentPrice = response.currentPrice;
                $('#tickers-grid').append(`
                    <p>Current Price: $${currentPrice.toFixed(2)}</p>
                `);
    
                // Fetch historical data to display chart and news data 
                fetchHistoricalData(ticker);
                fetchStockNews(ticker);

                // Fetch prediction data
                fetchPredictionData(ticker);
            },
            error: function(error) {
                console.error('Error fetching stock data:', error);
            }
        });
    }

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
                console.log(ticker);
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

                    // Destroy previous charts
                    if (priceChart) priceChart.destroy();
                    if (volumeChart) volumeChart.destroy();
                    if (averageChart) averageChart.destroy();
                    if (returnsChart) returnsChart.destroy();

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

    // Function to fetch prediction data and update the page
    function fetchPredictionData(ticker) {
        $.ajax({
            url: `/model-endpoint/${ticker}`,
            type: 'GET',
            success: function(response) {
                console.log("Prediction response:", response);
                document.querySelector("#predictions .search-bar").innerHTML = `<p>${response[0]}</p>`;
            },
            error: function(error) {
                console.error('Error fetching prediction data:', error);
            }
        });
    }

    // Event listener for the new form in the header
    $('#header-ticker-form').on('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        // Get the ticker symbol from the input field
        const ticker = $('#header-ticker').val();

        // Call the function to fetch and display stock data
        fetchStockData(ticker);
    });

    // Toggle dropdown menu
    $('#menu-icon').click(function() {
        $('#dropdown-menu').toggle();
    });

    // Top 10 performing stock visualizations:
    async function fetchData() {
        const response = await fetch('/plots_data');
        return response.json();
    }
    
    function plotData(data) {
        const traces = [];
        Object.keys(data).forEach(ticker => {
            const tickerData = data[ticker];
            const dates = tickerData.map(item => item.Date);
            const prices = tickerData.map(item => item.Close);
    
            const trace = {
                x: dates,
                y: prices,
                type: 'line',
                name: ticker
            };
    
            traces.push(trace);
        });
    
        const layout = {
            title: 'Stock Closing Prices',
            xaxis: { title: 'Date' },
            yaxis: { title: 'Price (USD)' }
        };
    
        Plotly.newPlot('plot', traces, layout);
    }
    
    function plotHeatmap(data) {
        const tickers = Object.keys(data);
        const dates = data[tickers[0]].map(item => item.Date);
        const heatmapData = tickers.map(ticker => data[ticker].map(item => item.Close));
    
        const trace = {
            z: heatmapData,
            x: dates,
            y: tickers,
            type: 'heatmap',
            colorscale: 'Viridis',
            colorbar: { title: 'Closing Price' }
        };
    
        const layout = {
            title: 'Heatmap of Closing Prices Over Time',
            xaxis: { title: 'Date' },
            yaxis: { title: 'Ticker' }
        };
    
        Plotly.newPlot('heatmap', [trace], layout);
    }
    
    function plotRollingStats(data) {
        const tickers = Object.keys(data);
        const traces = [];
    
        tickers.forEach(ticker => {
            const df = data[ticker];
            const dates = df.map(item => item.Date);
            const prices = df.map(item => item.Close);
    
            const rollingMean = calculateRollingMean(prices, 30);
            const rollingStd = calculateRollingStd(prices, 30);
    
            traces.push({
                x: dates,
                y: rollingMean,
                mode: 'lines',
                name: `${ticker} Rolling Mean`
            });
    
            traces.push({
                x: dates,
                y: rollingMean.map((mean, idx) => mean - 2 * rollingStd[idx]),
                fill: 'tozeroy',
                type: 'scatter',
                mode: 'none',
                name: `${ticker} Rolling Std`
            });
    
            traces.push({
                x: dates,
                y: rollingMean.map((mean, idx) => mean + 2 * rollingStd[idx]),
                fill: 'tonexty',
                type: 'scatter',
                mode: 'none',
                name: `${ticker} Rolling Std`
            });
        });
    
        const layout = {
            title: 'Rolling Mean and Std of Closing Prices',
            xaxis: { title: 'Date' },
            yaxis: { title: 'Price' }
        };
    
        Plotly.newPlot('rolling-stats', traces, layout);
    }
    
    function plotPairPlot(data) {
        const tickers = Object.keys(data);
        const numTickers = tickers.length;
        const df = tickers.map(ticker => data[ticker].map(item => item.Close));
    
        // Create an array to hold the subplot configuration
        const subplotTraces = [];
        
        // Initialize subplot grid
        for (let i = 0; i < numTickers; i++) {
            for (let j = 0; j < numTickers; j++) {
                if (i !== j) {
                    // Scatter plot for each pair of tickers
                    subplotTraces.push({
                        x: df[i],
                        y: df[j],
                        mode: 'markers',
                        type: 'scatter',
                        name: `${tickers[i]} vs ${tickers[j]}`,
                        xaxis: `x${i + 1}`,
                        yaxis: `y${j + 1}`
                    });
                } else {
                    // Diagonal subplots (can be histogram or empty)
                    subplotTraces.push({
                        x: df[i],
                        y: df[i],
                        mode: 'markers',
                        type: 'scatter',
                        name: tickers[i],
                        xaxis: `x${i + 1}`,
                        yaxis: `y${i + 1}`,
                        marker: { opacity: 0 } // Hide points in diagonal if desired
                    });
                }
            }
        }
    
        // Generate subplot layout
        const layout = {
            grid: {
                rows: numTickers,
                columns: numTickers,
                pattern: 'independent'
            },
            title: 'Pair Plot of Stock Prices',
            xaxis: { title: '', showgrid: false },
            yaxis: { title: '', showgrid: false }
        };
    
        // Set axis properties dynamically
        for (let i = 0; i < numTickers; i++) {
            layout[`xaxis${i + 1}`] = { title: tickers[i] };
            layout[`yaxis${i + 1}`] = { title: tickers[i], autorange: 'reversed' };
        }
    
        Plotly.newPlot('pair_plot', subplotTraces, layout);
    }
    
    function plotHistogram(data) {
        const tickers = Object.keys(data);
        const returns = tickers.map(ticker => {
            const prices = data[ticker].map(item => item.Close);
            return calculatePercentageChange(prices);
        });
    
        const traces = tickers.map((ticker, i) => ({
            x: returns[i],
            type: 'histogram',
            name: ticker,
            opacity: 0.5
        }));
    
        const layout = {
            title: 'Histogram of Returns',
            xaxis: { title: 'Return' },
            yaxis: { title: 'Frequency' }
        };
    
        Plotly.newPlot('histogram', traces, layout);
    }
    
    function plotBoxplot(data) {
        const tickers = Object.keys(data);
        const boxData = tickers.map(ticker => ({
            y: data[ticker].map(item => item.Close),
            type: 'box',
            name: ticker
        }));
    
        const layout = {
            title: 'Box Plot of Closing Prices',
            xaxis: { title: 'Ticker' },
            yaxis: { title: 'Closing Price' }
        };
    
        Plotly.newPlot('boxplot', boxData, layout);
    }
    
    function calculateRollingMean(prices, windowSize) {
        return prices.map((price, idx, arr) => {
            if (idx < windowSize - 1) return null;
            const window = arr.slice(idx - windowSize + 1, idx + 1);
            return d3.mean(window);
        });
    }
    
    function calculateRollingStd(prices, windowSize) {
        return prices.map((price, idx, arr) => {
            if (idx < windowSize - 1) return null;
            const window = arr.slice(idx - windowSize + 1, idx + 1);
            return d3.deviation(window);
        });
    }
    
    function calculatePercentageChange(prices) {
        return prices.slice(1).map((price, idx) => (price - prices[idx]) / prices[idx]);
    }
    
    fetchData().then(data => {
        plotData(data);
        plotHeatmap(data);
        plotRollingStats(data);
        plotPairPlot(data);
        plotHistogram(data);
        plotBoxplot(data);
    }).catch(error => console.error('Error fetching data:', error));
});
