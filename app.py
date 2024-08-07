import yfinance as yf
from flask import request, render_template, jsonify, Flask
import joblib
import tensorflow as tf
import tensorflow.keras as k
import numpy as np



scaler = joblib.load("s_scaler.pkl")
model  = k.models.load_model("stock_predictor.keras")



app = Flask(__name__, template_folder='templates')

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/model-endpoint/<symbol>")
def make_pred(symbol):
    data = yf.download(symbol)
    data = data.drop(columns="Adj Close")
    input = data[-20:]
    scaled_input = scaler.transform(input)
    input_reshaped = scaled_input.reshape(1,20,5)
    prediction = model.predict(input_reshaped)
    pred = np.ravel(np.argmax(prediction))[0]
    if pred == 0: 
        output = ["Stock is likely to go down"]
    else: 
        output = ["Stock is likely to go up"]

    return jsonify(output)
    

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

if __name__ == '__main__':
    app.run(debug=True)

