document.getElementById('menu-icon').addEventListener('click', function() {
    var menu = document.getElementById('dropdown-menu');
    menu.classList.toggle('show');
}); // This one is not working yet. 


document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'MHOHXS6S1KLTTLE3';

    async function fetchStockNews() {
        const stockInput = document.getElementById('stock-input').value;
        if (!stockInput) return alert('Please enter a stock symbol');

        try {
            const response = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${stockInput}&apikey=${apiKey}`);
            const data = await response.json();
            displayNews(data.feed);
        } catch (error) {
            console.error('Error fetching stock news:', error);
        }
    }

    function displayNews(articles) {
        const newsContainer = document.getElementById('news-container');
        newsContainer.innerHTML = '';
        if (!articles || articles.length === 0) {
            newsContainer.innerHTML = '<p>No news found.</p>';
            return;
        }

        articles.forEach(article => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');
            newsItem.innerHTML = `
                <h3>${article.title}</h3>
                <p>${article.summary}</p>
                <a href="${article.url}" target="_blank">Read more</a>
            `;
            newsContainer.appendChild(newsItem);
        });
    }

    window.fetchStockNews = fetchStockNews;
});
