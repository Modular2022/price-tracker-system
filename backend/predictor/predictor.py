#!/usr/bin/env /usr/bin/python3
from matplotlib import pyplot
from pandas.plotting import lag_plot
import pandas as pd


def predict_product_price(asin):
    pass

# Return DF
def preprocess_data(filename, nrows=100):
    # Read CSV price history file
    df = pd.read_csv(filename, nrows=nrows)
    
    # Transform date format to just date (01-01-12)
    df['date'] = pd.to_datetime(df['date']).dt.date

    # Use date as the index
    df.set_index('date', inplace = True)

    return df

def train_product_model(filename):
    df = preprocess_data(filename)

    # series.plot()
    # pyplot.show()

    # lag_plot(series)
    # pyplot.show()

    # from pandas.plotting import autocorrelation_plot
    # autocorrelation_plot(series)

    # from statsmodels.graphics.tsaplots import plot_acf
    # plot_acf(series, lags=31)
