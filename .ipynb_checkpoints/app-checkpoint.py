from flask import Flask, render_template, request
import yfinance as yf
import pandas as pd

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    stock_info = None
    if request.method == 'POST':
        ticker_symbol = request.form.get('ticker')
        if ticker_symbol:
            # Retrieve stock data based on user input
            stock = yf.Ticker(ticker_symbol)
            stock_info = stock.history(period='2y')
            # Optional: Convert the DataFrame to a dictionary for easier rendering
            stock_info = stock_info.reset_index().to_dict(orient='records')
    return render_template('index.html', stock_info=stock_info)

if __name__ == '__main__':
    app.run(debug=True)