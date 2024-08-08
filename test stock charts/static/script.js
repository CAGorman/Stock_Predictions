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
    const subplotTitles = [];
    
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
