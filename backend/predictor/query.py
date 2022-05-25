#!/usr/bin/env /usr/bin/python3
import subprocess
import history
import json
import os
from pathlib import Path
from predictor import predict


def main(args=None):
    # Search product using amazon-buddy
    keywords = ' '.join(args[1:])
    if not keywords:
        print("ERROR: Keywords required")
        return

    command = f"amazon-buddy products -k '{keywords}' --country 'MX' --filetype json"
    output = get_cmd_output(command)

    # Get json file with all found products
    filename = output.split(': ', 1)[1] + '.json'
    new_path = os.path.join('predictor', 'query_results', filename)
    try:
        Path(filename).rename(new_path)
    except Exception as e:
        print("ERROR: Can't rename/move file")
    asins = get_products_asins(new_path)

    # Use Keepas API to get rows of product dates and price history
    for i, asin in enumerate(asins):
        rows = history.get_price_history(asin)
        filename = f'{asin}_{i}.csv'
        history.save_price_history(filename, rows)
        predict(os.path.join(
            'predictor', 'training_data', filename))
        break  # TODO UNCOMMENT ###


def get_cmd_output(command):
    try:
        output = subprocess.getoutput(command)
        return output
    except subprocess.CalledProcessError as grepexc:
        print("Error code", grepexc.returncode, grepexc.output)


def get_products_asins(filename, query_dir='query_results'):
    asins = set()
    try:
        with open(filename, 'r') as f:
            products = json.load(f)
            for p in products:
                asin = p.get('asin', '')
                asins.add(asin)
                break  # TODO UNCOMMENT ###
    except FileNotFoundError as e:  # TODO JSON_ERROR ###
        print("ERROR: File not found")

    return asins
