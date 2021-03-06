# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
import os
import json
from turtle import update
import requests
from errors import TokenExpiredError
from errors import SequelizeUniqueConstraintError
from errors import UnkownError
import logging as log
from scrapy import signals
from scrapy.exporters import JsonItemExporter


from constants import *


class StoresPipeline:
    def process_item(self, item, spider):
        return item


'''  '''


class ServerPipeline:

    # Constructor
    def __init__(self):
        # Tokens
        self._tokens = {'token': '', 'refresh_token': ''}

        # Logger of scrapper
        self._logger = log.getLogger(__name__)

        # Headers for request
        self._headers = {'Authorization': 'Bearer ' + self._tokens['token'],
                         'Content-Type': 'application/json',
                         'Accept': '*/*',
                         #  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
                         'Accept-Encoding': 'gzip, deflate, br',
                         'Connection': 'keep-alive'}

        # Payload for request
        self._payload = {
            "email": "bonbeatleoz@gmail.com",
            "password": "yosoyelornok821"
        }
        self.server_login()

    def server_login(self):
        response = requests.post(LOGIN_CALL, data=json.dumps(self._payload),
                                 headers=self._headers)
        json_response = self.get_response_content(response)
        if not json_response or json_response['status'] == 'error':
            print("ERROR: Can't login")
            return

        self.refresh_token(json_response)
        self._tokens['refresh_token'] = json_response['refresh_token']
        return json_response

    #
    def refresh_token(self, json_response):
        self._tokens['token'] = json_response['token']
        self._headers['Authorization'] = 'Bearer ' + self._tokens['token']

    #
    def update_token(self):
        response = requests.post(UPDATE_TOKEN_CALL, data=json.dumps(
            self._tokens), headers=self._headers)
        json_response = self.get_response_content(response)
        if not json_response or json_response['status'] == 'error':
            print("ERROR: Could not update token.")

        self.server_login()

    #
    def add_product(self, product):
        if not product:
            return False

        response = requests.post(
            ADD_PRODUCT_CALL, data=product, headers=self._headers)
        json_response = self.get_response_content(response)
        if not json_response or json_response['status'] == 'error':
            print(f"ERROR: Couldn't ADD product: {product}")
            return False

        return True
    #

    def update_product(self, product):
        tmp = json.loads(product)
        updated_product_call = UPDATE_PRODUCT_CALL.format(
            sku=tmp['sku'], upc=tmp['upc'], store=tmp['store'])
        response = requests.patch(
            updated_product_call, data=product, headers=self._headers)
        json_response = self.get_response_content(response)
        if not json_response or json_response['status'] == 'error':
            print(f"ERROR: Couldn't UPDATE product: {product}")
            return False
        return True

    def get_price_prediction(self, product):
        # for every product
        #   make a query of product with title and get ASIN's
        #   get price history in keepas
        #   save date and price (and extra dimensions) on CSV

        # for the current product
        #   read csv
        #   train a SARIMA model
        #   make prediction
        pass

    #
    def is_token_expired(self):
        response = requests.post(
            CHECK_TOKEN_CALL, data=json.dumps({}), headers=self._headers)
        json_response = self.get_response_content(response)
        if not json_response or json_response['status'] == 'error':
            return True
        return False

    # This method is called for every item pipeline component
    def process_item(self, item, spider):
        if self.is_token_expired():
            self.update_token()

        product = json.dumps(dict(item), indent=4,
                             sort_keys=True, ensure_ascii=True)
        succeed = self.add_product(product)
        ### TODO UNCOMMENT LINES ###
        # if not succeed:
        #     self.update_product(product)

        print(product)

        return item

    # This method is called when the spider is closed
    def spider_closed(self, spider):
        pass

    def get_response_content(self, response):
        try:
            if not response:
                return None
            return response.json()
        except ValueError as e:
            print("ValueError" + e)


''' Json Pipeline this pipeline save the Item objects in to json file '''


class JsonPipeline(object):

    # Constructor
    def __init__(self):
        self._path = '/products/'

    # Create a pipeline instance from a Crawler and return a new instance of the pipeline
    @classmethod
    def from_crawler(cls, crawler):
        pipeline = cls()
        crawler.signals.connect(pipeline.spider_opened, signals.spider_opened)
        crawler.signals.connect(pipeline.spider_closed, signals.spider_closed)
        return pipeline

    # This method is called when the spider is closed
    def spider_closed(self, spider):
        self.exporter.finish_exporting()
        self.file.close()
        # pass

    # This method is called when the spider is opened
    def spider_opened(self, spider):
        self.update_folder(spider.name.split('-')[0])
        file_name = self._path + '/' + spider.name + '.json'
        self.file = open(file_name, 'wb')
        self.exporter = JsonItemExporter(
            self.file, encoding='utf-8', indent=4, sort_keys=False, ensure_ascii=False)
        self.exporter.start_exporting()

    # This method is called for every item pipeline component
    def process_item(self, item, spider):
        self.exporter.export_item(item)
        return item

    #
    def update_folder(self, store):
        self._path = os.getcwd() + self._path + store

        if not os.path.isdir('products'):
            os.mkdir('products')
        if not os.path.isdir(self._path):
            os.mkdir(self._path)
