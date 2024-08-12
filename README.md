![SPM_Header](https://github.com/user-attachments/assets/18e45651-f779-4e6c-a088-8f94f28e08be)
# Introduction
Our project aims to predict stock prices using advanced machine learning techniques, including Long Short-Term Memory (LSTM) networks. The model operates based on a look-back window of 20 days, allowing it to capture historical patterns and trends in stock prices. In addition to LSTM, we have explored and utilized various optimization techniques and models, including Keras Tuner, XGBoost, XGBoost with sentiment analysis, and Random Forests, to enhance prediction accuracy and performance.
Furthermore, we have developed and deployed an interactive website that allows users to select their stock of interest and view a comprehensive set of features, including:
- Real-time Stock Information: Access up-to-date details about the chosen stock.
- News Updates: Latest news related to the stock to help users stay informed.
- Comparative Graphs: Visual representations comparing the chosen stock with others.
- Predicted Stock Price: Forecasted future prices based on our models' predictions.
- Trend Predictions: Insights into whether the stock is predicted to go up or down.

# Model Optimization Process

This repository outlines the model optimization process using different machine learning algorithms and techniques for stock prediction tasks. Below, you'll find detailed information about the methods used, results achieved, and relevant visualizations.

## Random Forest

**Overview:**
Random Forest is an ensemble learning method that utilizes multiple decision trees to make predictions. It combines the results of individual trees to produce a more accurate and robust prediction. This method is effective in capturing complex non-linear patterns without requiring data transformations.

**Results:**
- Precision: 0.8929
- Accuracy: 0.5842
- Recall: 0.3906
- F1 Score: 0.5435
- R-squared: -0.7914

![Random Forest Results](https://github.com/user-attachments/assets/0c1df4a0-828e-4e3f-a673-750391ebc2b5)

## LSTM (Long Short-Term Memory)

**Overview:**
LSTM is a type of recurrent neural network (RNN) that excels in learning from sequential data, such as time series. It captures long-term dependencies and patterns, making it suitable for tasks like stock price predictions.

**Pros:**
- Sequence Memory
- Flexibility

**Cons:**
- Complexity
- Overfitting

**Data Pre-Processing:**
- **Look-back Windows:** These are crucial for analyzing stock data, allowing models to capture historical price patterns and trends. For example, a look-back window of 20 days helps in understanding recent trends and smoothing out short-term noise.

**Additional Steps:**
1. Drop rows with NaN target values.
2. Remove columns that do not provide meaningful information.
3. Split pre-processed data into features and target arrays.
4. Normalize data using `StandardScaler`.
5. Split data into training and testing sets.
6. Scale data using `MinMaxScaler`.

**Results:**
- Precision: 0.5556
- Accuracy: 0.4948
- Recall: 0.5455
- F1 Score: 0.5505
- R-squared: -1.0576

![LSTM Results](https://github.com/user-attachments/assets/9eefcd5c-c7ac-48eb-af92-75b23a253f91)

## XGBoost

### Regular

**Overview:**
XGBoost (eXtreme Gradient Boosting) is an efficient and versatile gradient boosting framework. It is widely used for structured or tabular data due to its high performance and accuracy.

**Pros:**
- High performance and accuracy
- Suitable for both regression and classification
- Built-in handling of missing data

**Cons:**
- Complexity
- Resource Intensive
- Overfitting
- Less effective on non-tabular data

**Results:**
- Precision: 0.9375
- Accuracy: 0.6436
- Recall: 0.4688
- F1 Score: 0.6250
- R-squared: -0.5355

![XGBoost Regular Results](https://github.com/user-attachments/assets/d4a3c804-982a-4f4f-b75f-a00f66b1e696)

### Sentiment Analysis

**Overview:**
XGBoost is used for sentiment analysis to predict stock prices based on textual data, such as news headlines and social media posts. This approach leverages market sentiment to predict stock movements.

**Results:**
- Precision: 0.5854
- Accuracy: 0.4356
- Recall: 0.3750
- F1 Score: 0.4571
- R-squared: -1.4312

![XGBoost Sentiment Analysis Results](https://github.com/user-attachments/assets/661ecc29-8d6c-4c90-b936-821e374fbc04)

## Keras Tuner with LSTM

**Overview:**
LSTM networks, combined with Keras Tuner, are used for tuning hyperparameters in the TensorFlow framework. Keras Tuner automates the process of finding the best hyperparameters for LSTM models.

**Pros:**
- Ease of use
- Flexible tuning strategies
- Automated tuning

**Cons:**
- Resource intensive
- Risk of overfitting
- Complex setup
- Specific to Keras

**Hyperparameters Tuned:**
1. **LSTM Units:**
   - Values: 50, 100, 150, 200
   - Defined by: `hp.Int('units', min_value=50, max_value=200, step=50)`
   
2. **Dropout Rate:**
   - Values: 0.0, 0.1, 0.2, 0.3, 0.4, 0.5
   - Defined by: `hp.Float('dropout', min_value=0.0, max_value=0.5, step=0.1)`

**Results:**
- MSE: 0.0019
- RMSE: 0.0440
- MAE: 0.0342
- R-squared: 0.9496

![Keras Tuner Results](https://github.com/user-attachments/assets/2be7131e-1cfb-4fe3-bfbe-1a3311d6f382)

# Conclusion

![Scatter](https://github.com/user-attachments/assets/0c0a0216-b5c4-46d1-9e58-7a8e8db44804)

![Table](https://github.com/user-attachments/assets/990f4656-2539-4905-9070-8522d1204f8e)

LSTM (Long Short-Term Memory) networks are highly effective for working with Yahoo Finance data because of their ability to capture long-term patterns in time series data, making them ideal for stock price prediction. LSTMs are particularly adept at recognizing trends and cycles over extended periods, which is essential for accurate forecasting. Their flexibility also allows for the integration of multiple financial indicators, like stock prices and trading volumes, to improve predictive accuracy. However, LSTMs come with challenges, including their complexity, which makes them resource-intensive to train, and a tendency to overfit, especially in noisy and volatile markets.
To enhance the performance of LSTM models on financial data, Keras Tuner is an invaluable tool for automating the hyperparameter tuning process. It streamlines the selection of optimal hyperparameters, such as the number of LSTM units or learning rate, customized to the unique characteristics of Yahoo Finance data. Although Keras Tuner is user-friendly and offers flexible tuning strategies, it also presents challenges, including its high demand on resources and the risk of overfitting if not carefully controlled. Therefore, while the combination of LSTM networks and Keras Tuner can yield powerful stock prediction models, careful management of these complexities is essential to prevent overfitting and ensure strong performance on new data.



