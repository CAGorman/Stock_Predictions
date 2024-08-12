![SPM_Header](https://github.com/user-attachments/assets/18e45651-f779-4e6c-a088-8f94f28e08be)

## Model Optimization Process
### Random Forest
Random Forest is an ensemble learning method based on decision tree algorithms. It creates a multitude of decision trees at training time and outputs the mean/average prediction of the individual trees. Random Forest can capture complex non-linear patterns without needing transformations.

- Precision: 0.8928571428571429
- Accuracy: 0.5841584158415841
- Recall: 0.390625
- F1 Score: 0.5434782608695653
- R-squared: -0.7913851351351346

![Screenshot 2024-08-12 at 3 44 10 PM](https://github.com/user-attachments/assets/0c1df4a0-828e-4e3f-a673-750391ebc2b5)

## LSTM
STOCK PREDICTIONS using LSTM
LSTM is a type of recurrent neural network (RNN) particularly good at learning from sequences (such as time series data). It can capture long-term dependencies and patterns in time series data, making it suitable for tasks like stock price predictions.
Pros: Sequence Memory, Flexibility Cons: Complexity, Overfitting

### Data Pre-Processing
Look-back windows are essential for analyzing stock data because they allow models to capture and leverage historical price patterns, trends, and seasonality to predict future movements. By examining a fixed period of past data, such as the last 20 days, these windows enable models to learn from recent trends and fluctuations, thereby improving their forecasting accuracy. Additionally, look-back windows help in feature engineering and smoothing out short-term noise, ensuring that predictions are based on meaningful patterns rather than random variations.
![lookback code](https://github.com/user-attachments/assets/1d9a55e2-7843-4de1-a0bb-8cad784f1579)

**Additional Steps**
1. Drop rows with NaN target values
2. Dropped columns that do not provide meaningful information to focus further on key features
3. Splitting pre-processed data into features and target arrays
4. Data normalization utilizing StandardScaler
5. Splitting data into training and testing sets
6. Scaling data utilizing MinMaxScaler


- Precision: 0.5555555555555556
- Accuracy: 0.4948453608247423
- Recall: 0.5454545454545454
- F1 Score: 0.5504587155963303
- R-squared: -1.0575757575757576

![lstm](https://github.com/user-attachments/assets/9eefcd5c-c7ac-48eb-af92-75b23a253f91)

## XGBoost: Regular + Sentiment Analysis
### Regular
XGBoost, which stands for eXtreme Gradient Boosting, is a highly efficient and versatile implementation of the gradient boosting framework. It has become one of the most popular machine learning algorithms among data scientists, especially for structured or tabular data. XGBoost is known for its performance and speed, particularly in classification and regression predictive modeling problems.
PROS: High performance and accuracy, Can ber used for Regression and Classification, Built in function to handle missing data. CONS: Complexity, Resource Intensive, Overfitting,Less effective on Non-Tabular data.

- Precision: 0.9375
- Accuracy: 0.6435643564356436
- Recall: 0.46875
- F1 Score: 0.625
- R-squared: -0.5354729729729726

![reg xgboost](https://github.com/user-attachments/assets/d4a3c804-982a-4f4f-b75f-a00f66b1e696)

### Sentiment Analysis
Using XGBoost for sentiment analysis in the context of predicting stock prices involves analyzing textual data (such as news headlines, financial reports, or social media posts) to gauge market sentiment and using that information as a predictive factor for stock movements. This approach is based on the hypothesis that sentiment from influential news sources or public opinion can have immediate effects on stock market performance.

- Precision: 0.5853658536585366
- Accuracy: 0.43564356435643564
- Recall: 0.375
- F1 Score: 0.45714285714285713
- R-squared: -1.43116554054054

![sentiment xgboost](https://github.com/user-attachments/assets/661ecc29-8d6c-4c90-b936-821e374fbc04)

## Keras Tuner with LSTM
LSTM is a type of recurrent neural network (RNN) particularly good at learning from sequences (such as time series data). It can capture long-term dependencies and patterns in time series data, making it suitable for tasks like stock price predictions.
Pros: Sequence Memory, Flexibility Cons: Complexity, Overfitting
KERAS TUNER is a library for scalable hyperparameter tuning, that chooses the best set of hyperparameters for your neural network. It's specifically designed for tuning KERAS models within the TensorFlow framework. PROS: Ease of use, Flexible tuning strategies, Automated tuning CONS: Resource intensive, Overfitting risk, Complex setup, Only for KERAS

### Hyperparameters
1. LSTM Units:
   - The number of units in the LSTM layers is a hyperparameter. It can be one of the following values: 50, 100, 150, or 200. This is defined by:
     hp.Int('units', min_value=50, max_value=200, step=50)
    
2. Dropout Rate:
   - The dropout rate for the Dropout layers is also a hyperparameter. It can be one of the following values: 0.0, 0.1, 0.2, 0.3, 0.4, or 0.5. This is defined by:
     hp.Float('dropout', min_value=0.0, max_value=0.5, step=0.1)


The number of units is a tunable hyperparameter, with a range set from 50 to 200. The step size of 50 means that the tuner will increment the number of units by 50 at each step. This stepping helps in exploring different model capacities systematically without making the tuning excessively fine-grained, Dropout randomly sets a fraction of the input units to 0 at each update during training time to prevent overfitting. The output layer with a single neuron. Since it uses a default linear activation function ('None'specified), this setup is typical for regression tasks like predicting a value (e.g., stock price).

- MSE: 0.0019401842056118953
- RMSE: 0.044047522127946034
- MAE: 0.034159542079231414
- R-squared: 0.9496328576691679

![Keras tuner](https://github.com/user-attachments/assets/2be7131e-1cfb-4fe3-bfbe-1a3311d6f382)

