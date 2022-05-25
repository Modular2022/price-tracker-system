import csv
import keepa
import pandas as pd
import os

ACCESS_KEY = '9cu5sko03c20mo0vn4irtm6v3q3f64idaemmc5tqo55hc71n95a96gaj2g4p34c1'

def get_price_history(asin):
    api = keepa.Keepa(ACCESS_KEY)
    products = api.query(asin, domain='MX') 
    
    if not products:
        print(f"ERROR: Can't find product with ASIN: {asin}.")
        return None

    # Access new price history and associated time data
    product = products[0]
    new_prices = product['data']['NEW']
    new_prices_times = product['data']['NEW_time']

    return zip(new_prices_times, new_prices)
    

def save_price_history(filename, rows, headers=('date', 'price'), training_dir='training_data'):
    path = os.path.join('predictor', training_dir, filename)
    with open(path, 'w') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)

if __name__ == '__main__':
    # TEST
    # get_price_history('B08F44M292')
    save_price_history('B08F44M292')