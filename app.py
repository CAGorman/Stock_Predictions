import yfinance as yf
from flask import request, render_template, jsonify, Flask

app = Flask(__name__, template_folder='templates')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_stock_data', methods=['POST'])
def get_stock_data():
    ticker = request.get_json()['ticker']
    data = yf.Ticker(ticker).history(period='1y')
    historical_data = data.reset_index().to_dict(orient='records')
    return jsonify({
        'currentPrice': data.iloc[-1].Close,
        'data': historical_data
    })

if __name__ == '__main__':
    app.run(debug=True)

