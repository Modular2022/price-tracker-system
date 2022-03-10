import re
import json
import scrapy
import datetime
from bs4 import BeautifulSoup

from scrapy import item

from stores.items import Product

class ElektraSpider(scrapy.Spider):
    name = 'elektra'

    allowed_domains = ['elektra']
    start_urls = ['https://google.com/']

    HEADERS = {'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'es-419,es;q=0.9',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'none',
            'sec-gpc': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36 OPR/74.0.3911.107'}


    today = datetime.date.today()
    log_file_name = 'log/elektra/log_elektra-{today}.txt'.format(today=today)

    custom_setting = {
        'LOG_FILE': log_file_name,
        'LOG_FORMAT': '%(levelname)s: %(message)s',
    }

    def __init__(self, urls):
        self._products_urls = urls
        print('INIT ELEKTRA')

    def parse(self, response):
        for url in self._products_urls:
            response = scrapy.Request(url, callback=self.prepare_product, headers=self.HEADERS, dont_filter=True)
            yield response

    def prepare_product(self, response):
        product = Product()

        product_json = self.get_product_json(response)
        product_key = "Product:" + response.url.split('/')[-2]
        data = product_json[product_key]

        product['store'] = self.name
        product['url'] = response.url
        product['sku'] = data['productId']
        product['upc'] = data['productId']
        product['name'] = data['productName']
        product['brand'] = data['brand']
        product['description'] = data['description']
        product['description'] = self.clean_text(product['description'])

        department = data['categories']['json'][0].split('/')
        product['department'] = department[-2] if len(department) > 1 else department[0]

        product['images'] = [product_json[k]['imageUrl'] for k in product_json.keys() if  'Image:' in k]
        
        characteristics_key = product_key + '.specificationGroups.0.specifications.'
        characteristics_keys = [k for k in product_json.keys() if characteristics_key in k]

        product['summary'] = []
        product['characteristics'] = {}
        for key in characteristics_keys:
            key_value = product_json[key]
            charac_name = key_value['name']
            if charac_name == 'Abonoprecios':
                continue
            characteristic = key_value['values']['json'][0]
            if 'Customer Bennefits' in charac_name:
                product['summary'].append(characteristic)
            else:
                product['characteristics'][charac_name] = characteristic

        product['characteristics'] = self.clean_characteristics(product['characteristics'])
        product['summary'] = '' if len(product['summary']) == 0 else self.clean_summary(product['summary'])

        price_key = "$" + product_key + '.items.0.sellers.0.commertialOffer'
        product['price'] = product_json[price_key]['Price']

        if product_json[price_key]['AvailableQuantity'] == 0:
            print('Producto no disponible')
            product.clear()

        return product
    
    def get_product_json(self, response):
        product_json = response.selector.xpath("//template[@data-varname='__STATE__']").get()
        product_json = re.findall(r"<script>(.*?)<\/script>", product_json, flags=re.M)[0]
        return json.loads(product_json)

    def clean_text(self, text):
        html_tags = re.compile('<.*?>') 
        clean_text = re.sub(html_tags, '', text)
        return clean_text
    
    def clean_characteristics(self, characteristics):
        for key, value in characteristics.items():
            characteristics[key] = self.clean_text(value)
        return characteristics
    
    def clean_summary(self, summary):
        cleaned_summary = []
        for item in summary:
            cleaned_summary.append(self.clean_text(item))
        ''.join(cleaned_summary)
        return cleaned_summary