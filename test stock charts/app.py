from flask import Flask, render_template, jsonify
import yfinance as yf
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/plots_data')
def data():
    tickers = ['SMCI', 'NVDA', 'ANET', 'NTAP', 'AVGO', 'KLAC', 'FICO', 'GDDY', 'MPWR', 'TYL']
    end_date = datetime.now().strftime('%Y-%m-%d')
    
    all_data = {}
    for ticker in tickers:
        data = yf.download(ticker, start='2024-01-01', end=end_date)
        data.reset_index(inplace=True)
        all_data[ticker] = data.to_dict(orient='records')
    
    return jsonify(all_data)

if __name__ == '__main__':
    app.run(debug=True)
