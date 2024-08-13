// analysis.js

// Function to fetch data and plot visualizations
async function fetchData() {
    const response = await fetch('/plots_data');
    return response.json();
}

function plotData(data) {
    const traces = [];
    Object.keys(data).forEach(ticker => {
        const tickerData = data[ticker];
        const dates = tickerData.map(item => new Date(item.Date).toISOString().split('T')[0]);
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
    // Function to format dates as "Month YYYY"
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = { year: 'numeric', month: 'long' }; // "Month YYYY" format
      return new Intl.DateTimeFormat('en-US', options).format(date);
    };
    // Extract and format dates
    const dates = data[tickers[0]].map(item => formatDate(item.Date));
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
      xaxis: {
        title: 'Date',
        tickangle: 45, // Rotate labels for better readability
        tickformat: '%B %Y' // Plotly format for "Month YYYY"
      },
      yaxis: { title: 'Ticker' }
    };
    Plotly.newPlot('heatmap', [trace], layout);
  }

  function plotRollingStats(data) {
    const tickers = Object.keys(data);
    const traces = [];
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
      };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    };
    tickers.forEach(ticker => {
      const df = data[ticker];
      const dates = df.map(item => formatDate(item.Date));
      const prices = df.map(item => item.Close);
      const rollingMean = calculateRollingMean(prices, 30);
      const rollingStd = calculateRollingStd(prices, 30);
      const validDataIndices = rollingMean.map((value, index) => (value !== null && !isNaN(value)) ? index : null).filter(index => index !== null);
      const validDates = validDataIndices.map(index => dates[index]);
      const validRollingMean = validDataIndices.map(index => rollingMean[index]);
      traces.push({
        x: validDates,
        y: validRollingMean,
        mode: 'lines',
        name: `${ticker} Rolling Mean`
      });
      traces.push({
        x: validDates,
        y: validRollingMean.map((mean, idx) => mean - 2 * rollingStd[idx]),
        fill: 'tozeroy',
        type: 'scatter',
        mode: 'none',
        name: `${ticker} Rolling Std`
      });
      traces.push({
        x: validDates,
        y: validRollingMean.map((mean, idx) => mean + 2 * rollingStd[idx]),
        fill: 'tonexty',
        type: 'scatter',
        mode: 'none',
        name: `${ticker} Rolling Std`
      });
    });
    const layout = {
      title: 'Rolling Mean and Std of Closing Prices',
      xaxis: {
        title: 'Date',
        tickangle: 40
        },
      yaxis: { title: 'Price' }
    };
    Plotly.newPlot('rolling-stats', traces, layout);
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

// Fetch data and plot visualizations
fetchData().then(data => {
    plotData(data);
    plotHeatmap(data);
    plotRollingStats(data);
    plotHistogram(data);
    plotBoxplot(data);
}).catch(error => console.error('Error fetching data:', error));
