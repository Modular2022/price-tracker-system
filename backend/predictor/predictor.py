from statsmodels.tsa.arima.model import ARIMA
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import json

def plot_df(df, x, y, title="", xlabel='Date', ylabel='Value', dpi=100):
    plt.figure(figsize=(16, 5), dpi=dpi)
    plt.plot(x, y, color='tab:red')
    plt.gca().set(title=title, xlabel=xlabel, ylabel=ylabel)
    plt.show()


def preprocess_data(filename, nrows=100):
    # Read CSV price history file
    df = pd.read_csv(filename, nrows=nrows, parse_dates=['date'])
    # df = pd.read_csv(filename, parse_dates=['date'], squeeze=True)
    # Transform date format to just date (01-01-12)
    df['date'] = pd.to_datetime(df['date']).dt.date
    # # Use date as the index
    df.set_index('date', inplace=True)

    df.index = pd.DatetimeIndex(df.index).to_period('M')

    return df


def train_model(series):
    model = ARIMA(series, order=(2, 0, 1))
    model_fit = model.fit()

    # summary of fit model
    model_fit.summary()

    return model_fit


def predict_price(series, model_fit):
    inicial = series.price[len(series)-1]
    final = model_fit.predict(len(series), len(series))
    final = final.values[0]
    val = inicial < final    
    percentile = ((final - inicial)/inicial)
    return json.dumps({
        'goesUp': str(val).lower(),
        'value': final,
        'percentage': percentile
    })


def predict(filename):
    series = preprocess_data(filename)
    model = train_model(series)
    json_obj = predict_price(series, model)
    print(json_obj)

    # plot_df(series, x=series.index, y=series.price, title='Sales')

    # from pandas.plotting import autocorrelation_plot
    # autocorrelation_plot(series)

    # train = series[series.index < pd.to_datetime("2022-04-01", format='%Y-%m-%d')]
    # test = series[series.index > pd.to_datetime("2022-04-02", format='%Y-%m-%d')]
