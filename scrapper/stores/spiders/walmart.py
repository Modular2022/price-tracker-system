import re
import json
import scrapy
import logging
import datetime
# from items import Product
from stores.items import Product
from scrapy.utils.log import configure_logging 

''' Walmart Spider huehuehue

    Attributes:
        name
        allowed_domains
        start_urls
        HEADERS
'''

class WalmartSpider(scrapy.Spider):
    name = 'walmart'

    allowed_domains = ['walmart']
    start_urls = ['https://www.google.com/']

    #
    img_url = 'https://res.cloudinary.com/walmart-labs/image/upload/w_225,dpr_auto,f_auto,q_auto:good/mg'

    # 
    HEADERS = {'accept': 'application/json',
               'accept-encoding': 'gzip, deflate, br',
               'accept-language': 'es-ES,es;q=0.9',
               'content-type': 'application/json',
               'referer': 'https://www.google.com/',
               'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
               'sec-ch-ua-mobile': '?0',
               'sec-fetch-dest': 'empty',
               'sec-fetch-mode': 'cors',
               'sec-fetch-site': 'same-origin',
               'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
               'wmx_svc_params': 'channel=4',
               'x-requested-with': 'XMLHttpRequest'}

    # 
    today = datetime.date.today()
    log_file_name = 'logs/walmart/log_walmart-{today}.txt'.format(today=today)

    #
    custom_settings = {
        'LOG_FILE': log_file_name,
        'LOG_FORMAT': '%(levelname)s: %(message)s',
    }


    # 
    def __init__(self, urls):
        self._base_url = 'https://www.walmart.com.mx/api/rest/model/atg/commerce/catalog/ProductCatalogActor/getProduct?id='
        self._products_urls = urls
        self._count = 0 

    # 
    def parse(self, response):
        # ID viene al final del URL 'tipico' después de un '_'
        
        for url in self._products_urls:
            sku = url.split('_')[-1]
            r_url = self._base_url + sku
            response = scrapy.Request(
                r_url, callback=self.prepare_product, headers=self.HEADERS, dont_filter=True)
            yield response

    # 
    def prepare_product(self, response):
        product = Product()
        raw_data = None

        try:
            raw_data = response.body
        except:
            raw_data = response.content
        
        raw_data = json.loads(raw_data)

        is_available = self.is_aviable_product(raw_data)
        exist_product = self.exist_product(raw_data)
        if exist_product and is_available:
            data = raw_data['product']['childSKUs'][0]

            product['store'] = self.name.split('-')[0]
            product['url'] = 'https://www.walmart.com.mx' + raw_data['product']['productSeoUrl']
            product['sku'] = data['id']
            product['upc'] = data['upc']

            try:
                product['name'] = data['displayName']
            except KeyError:
                product['name'] = ''

            try:
                product['brand'] = data['brand']
            except KeyError:
                product['brand'] = ''

            try:
                product['summary'] = data['description']
            except KeyError:
                product['summary'] = ''

            try:
                product['images'] = [data['thumbnailImageUrl'].split('?')[0]]
            except:
                pass

            try:
                for image in data['secondaryImages']:
                    product['images'].append(image['small'].split('?')[0])
            except:
                pass

            try:
                product['images'] = [ str(self.img_url + url) for url in product['images'] ]
            except KeyError:
                product['images'] = ['']

            try:
                breadcrumb = raw_data['product']['breadcrumb']
                product['department'] = breadcrumb['departmentName']
            except:
                product['department'] = ''

            try:
                product['description'] = data['seoDescription']
                product['description'] = '\n'.join(product['description'].split('$$')).replace('\n\n', '\n')
                product['description'] = re.sub(
                    '<[^>]*>', ' ', product['description']).replace('  ', '\n')[0::]
            except:
                product['description'] = ''

            try:
                product['characteristics'] = {}
                for attr in data['dynamicFacets'].values():
                    product['characteristics'][attr['attrName']] = ''.join(attr['value'])
            except:
                product['characteristics'] = ['']
                product['price'] = data['offerList'][0]['priceInfo']['specialPrice']
            return product

        else:
            print('*'*50)
            print('D E S C O N T I N U A D O')
            print('*'*50)
        return product

    # 
    def exist_product(self, data):
        try:
            data['product']['childSKUs'][0]
            return True
        except:
            return False

    # 
    def is_aviable_product(self, data):
        try:
            data = data['product']['childSKUs'][0]
            data['offerList'][0]['priceInfo']['specialPrice']
            return True
        except:
            return False
