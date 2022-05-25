#!/usr/bin/env /usr/bin/python3
from ast import Store
import os
import re
import gzip
import json
from reprlib import recursive_repr
from unittest import runner
import requests
import random
import hashlib

from sys import argv

from bs4 import BeautifulSoup as Soup
from scrapy.http import headers
from constants import *
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings

'''  '''


class Sitemap:

    def __init__(self, store):
        self.store = store
        self.store_url = STORE_URLS[store]
        self.site_keyword = KEYWORD[store]
        self.products_urls = set()
        # self.products_urls = []

    def create_sitemap(self):
        if self.store == 'walmart':
            return WalmartSitemap()
        elif self.store == 'sams':
            return SamsSitemap()
        elif self.store == 'liverpool':
            return LiverpoolSitemap()
        elif self.store == 'costco':
            return CostcoSitemap()
        elif self.store == 'elektra':
            return ElektraSitemap()
        elif self.store == 'homedepot':
            return HomedepotSitemap()
            
    def get_xml_response(self, url):
        response = requests.get(url, headers=HEADERS)
        if (200 != response.status_code):
            return None
        string_xml = response.content.decode('utf-8')
        return string_xml

    def parse_xml(self, xml):
        urls = re.findall(r"<loc>(.*?)<\/loc>", xml, flags=re.M)
        return urls

    def extract_urls_from_sitemap(self, url=None):
        url = self.store_url if url == None else url
        xml = self.get_xml_response(url)
        if not xml:
            return
        urls = self.parse_xml(xml)
        return urls

    def extract_products_from_urls(self, urls):
        for url in urls:
            if self.site_keyword in url:
                p = self.extract_urls_from_sitemap(url)
                if p:
                    self.products_urls.update(p)
                    break  # TODO: REMOVE LINE
        return list(self.products_urls)


'''  '''


class WalmartSitemap(Sitemap):

    def __init__(self):
        super().__init__(store)
        create_logs_dir(store)
        print(self.store_url)

    def crawl_entire_site(self):
        urls = self.extract_urls_from_sitemap()
        if not urls:
            print("Productos no encontrados")
            return
        products_urls = self.extract_products_from_urls(urls)
        print('Productos encontrados', len(products_urls))
        return products_urls


'''  '''


class LiverpoolSitemap(Sitemap):

    def __init__(self):
        super().__init__(store)
        create_logs_dir(store)
        print(self.store_url)

    def crawl_entire_site(self):
        urls = self.extract_urls_from_sitemap()
        products_urls = self.extract_products_from_urls(urls)
        print('Productos encontrados', len(products_urls))
        return products_urls


'''  '''


class SamsSitemap(Sitemap):

    def __init__(self):
        self.store_json = 'https://www.sams.com.mx/sams/home/?format=json&'

        self.json_sku_url = 'https://www.sams.com.mx/sams/browse{path}?_='

        super().__init__(store)
        create_logs_dir(store)
        print(self.store_url)

    def crawl_entire_site(self):
        urls = self.extract_urls_from_sitemap()
        products_urls = self.extract_products_from_urls(urls)
        products_urls = [url.split('/')[-1] for url in products_urls]
        return products_urls

    def get_url_json(self, url=None):
        url = self.store_json if url == None else url
        response = requests.get(url, headers=HEADERS)
        raw_data = response.content
        json_data = json.loads(raw_data)
        return json_data


'''  '''


class CostcoSitemap(Sitemap):

    def __init__(self):
        super().__init__(store)
        create_logs_dir(store)
        print(self.store_url)

    def crawl_entire_site(self):
        urls = self.extract_urls_from_sitemap()
        products_urls = self.extract_products_from_urls(urls)
        print('Productos encontrados: ', len(products_urls))
        return products_urls


'''  '''


class ElektraSitemap(Sitemap):

    def __init__(self):
        super().__init__(store)
        create_logs_dir(store)
        print(self.store_url)

    def crawl_entire_site(self):
        urls = self.extract_urls_from_sitemap()
        products_urls = self.extract_products_from_urls(urls)
        print('Productos encontrados: ', len(products_urls))
        return products_urls


'''  '''


class HomedepotSitemap(Sitemap):

    def __init__(self):
        super().__init__(store)
        create_logs_dir(store)
        print(self.store_url)

    def crawl_entire_site(self):
        urls = self.extract_urls_from_sitemap()
        products_urls = self.extract_urls_from_subsitemap(urls)
        print('Productos encontrados: ', len(products_urls))
        return products_urls

    def extract_urls_from_subsitemap(self, urls):
        products_urls = []
        tmp_urls = []
        for url in urls:
            decompressed_response = self.get_compressed_response(url)
            urls = self.parse_xml(decompressed_response)
            valid_urls = [url for url in urls if url.count(
                '/') > 4 and 'bano' not in url]
            tmp_urls.append(valid_urls)
        for url in tmp_urls:
            products_urls += url
        return products_urls

    def get_compressed_response(self, url):
        response = requests.get(url, stream=True)
        decompressed = gzip.decompress(response.content)
        decompressed = decompressed.decode('utf-8')
        return decompressed


'''  '''


def create_logs_dir(store):
    logs_dir = 'logs'
    store_logs = logs_dir + '/' + store
    if not os.path.isdir(logs_dir):
        os.mkdir(logs_dir)
    if not os.path.isdir(store_logs):
        os.mkdir(store_logs)


'''  '''

store = argv[1]
print('Tienda -> ', store)
s = Sitemap(store).create_sitemap()

products_urls = s.crawl_entire_site()
random.shuffle(products_urls) #UNCOMMENT

process = CrawlerProcess(get_project_settings())
# products_urls = products_urls[0:2]  # TODO: REMOVE LINE
process.crawl(store, urls=products_urls)
process.start()

# runner = CrawlerRunner(get_project_settings())
# stores = argv[1:]
# for store in stores:
#     runner.crawl(store, urls=products_urls)
# deferred = runner.join()
# deferred.addBoth(lambda _: reactor.stop())
# reactor.run()
