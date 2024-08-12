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

Precision: 0.9375
Accuracy: 0.6435643564356436
Recall: 0.46875
F1 Score: 0.625
R-squared: -0.5354729729729726

### Sentiment Analysis
Using XGBoost for sentiment analysis in the context of predicting stock prices involves analyzing textual data (such as news headlines, financial reports, or social media posts) to gauge market sentiment and using that information as a predictive factor for stock movements. This approach is based on the hypothesis that sentiment from influential news sources or public opinion can have immediate effects on stock market performance.
