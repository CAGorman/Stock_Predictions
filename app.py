import yfinance as yf
from flask import request, render_template, jsonify, Flask
import joblib
import tensorflow as tf
import tensorflow.keras as k
import numpy as np
from datetime import datetime


scaler = joblib.load("scaler.pkl")
model  = k.models.load_model("trained_model.keras")


app = Flask(__name__, template_folder='templates')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analysis')
def analysis():
    return render_template('analysis.html')

@app.route("/model-endpoint/<symbol>")
def make_pred(symbol):
    # Latest data for the specified symbol
    data = yf.download(symbol)
    
    if 'Adj Close' in data.columns:
        data = data.drop(columns='Adj Close')
    
    # Use the last 20 rows of data (timestep)
    input_data = data[-20:]
    
    # Ensure 'Close' column is used and properly scaled
    if 'Close' not in input_data.columns:
        return jsonify({"error": "No 'Close' column in the data."}), 400
    
    # Extract the 'Close' prices and scale them
    input_data = input_data[['Close']].values
    scaled_input = scaler.transform(input_data)
    
    # Reshape input for LSTM model
    input_reshaped = scaled_input.reshape(1, 20, 1)  # Adjust time_step and feature dimension if necessary
    
    # Make prediction
    prediction = model.predict(input_reshaped)
    
    # Regression output (predicted stock price)
    predicted_price = float(scaler.inverse_transform(prediction)[0][0])
    
    # Binary classification output for up/down prediction
    pred_class = np.argmax(prediction, axis=-1)[0]
    
    # Provide output based on prediction
    if pred_class == 0:
        direction = "Stock is likely to go down"
    else:
        direction = "Stock is likely to go up"
    
    return jsonify({
        "predicted_price": round(predicted_price, 2),
        "direction": direction
    })


@app.route('/get_stock_data', methods=['POST'])
def get_stock_data():
    ticker = request.get_json()['ticker']
    data = yf.Ticker(ticker).history(period='1y')
    historical_data = data.reset_index().to_dict(orient='records')
    return jsonify({
        'currentPrice': data.iloc[-1].Close,
        'data': historical_data
    })

@app.route('/get_stock_news', methods=['POST'])
def get_stock_news():
    ticker = request.get_json()['ticker']
    stock = yf.Ticker(ticker)
    news = stock.news
    return jsonify(news)

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

