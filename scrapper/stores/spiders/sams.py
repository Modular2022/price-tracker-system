import re
import json
import scrapy
import datetime
# from items import Product
from stores.items import Product
from scrapy.utils.log import configure_logging 

''' Sam Spider huehuehue

    Attributes:
        name
        allowed_domains
        start_urls
        HEADERS
'''

class SamsSpider(scrapy.Spider):
    name = 'sams'
    allowed_domains = 'www.sams.com.mx'
    start_urls = ['https://www.google.com/']

    img_url = 'https://assets.sams.com.mx/image/upload/f_auto,q_auto:eco,w_350,c_scale,dpr_auto/mx'

    HEADERS = {'accept': 'application/json, text/javascript, */*; q=0.01',
               'accept-encoding': 'gzip, deflate, br',
               'accept-language': 'es-ES,es;q=0.9',
               'referer': 'https://www.google.com',
               'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
               'sec-ch-ua-mobile': '?0',
               'sec-fetch-dest': 'empty',
               'sec-fetch-mode': 'cors',
               'sec-fetch-site': 'same-origin',
               'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
               'x-requested-with': 'XMLHttpRequest'}

    # 
    today = datetime.date.today()
    log_file_name = 'logs/sams/log_sams-{today}.txt'.format(today=today)

    #
    custom_settings = {
        'LOG_FILE': log_file_name,
        'LOG_FORMAT': '%(levelname)s: %(message)s',
    }

    def __init__(self, urls):
        self._products_urls = urls
        self._base_url = 'https://www.sams.com.mx/rest/model/atg/commerce/catalog/ProductCatalogActor/getSkuSummaryDetails?skuId={sku}&upc={sku}&storeId=0000009999'

    def parse(self, response):
        # ID viene al final del URL 'tipico' después del último '/'

        for url in self._products_urls:
            sku = url.split('/')[-1]
            url = self._base_url.format(sku=sku)

            response = scrapy.Request(
                url, callback=self.parse_product, headers=self.HEADERS, dont_filter=True)
            yield response

    def parse_product(self, response):
        product = Product()

        try:
            raw_data = response.body
        except:
            raw_data = response.content

        raw_data = json.loads(raw_data)
        exist_product = self.exist_product(raw_data)

        if exist_product:
            data = raw_data['sku']

            product['store'] = self.name
            product['url'] = self.allowed_domains + raw_data['seoURL']
            product['sku'] = raw_data['skuId']
            product['upc'] = data['upc']
            product['name'] = data['productDisplayName']

            try:
                product['brand'] = data['brand']
            except:
                product['brand'] = ''

            try:
                product['summary'] = data['seoDescription']
                product['summary'] = re.sub('<[^>]*>', ' ', product['summary']).replace('  ', '\n')[1::]
            except:
                product['summary'] = ''

            product['images'] = []
            try:
                for attr in data['auxiliaryMedia']:
                    if '_MEDIUM' in attr:
                        product['images'].append(str(self.img_url + data['auxiliaryMedia'][attr]['url']))
            except:
                pass

            try:
                product['department'] = raw_data['department']
                product['description'] = re.sub(
                    '<[^>]*>', ' ', ''.join(raw_data['longDescription'])).replace('  ', '.\n')
            except:
                product['department'] = ''

            product['characteristics'] = {}
            try:
                for attr in raw_data['attributesMap']['skuCharacteristicsList']:
                    product['characteristics'][attr['attrName']] = re.sub(
                        '<[^>]*>', ' ', attr['value']).replace('  ', '. ')
            except:
                product['characteristics'] = {}

            product['price'] = raw_data['specialPrice'] if raw_data['isPriceStrike'] else raw_data['basePrice']
        
        else:
            print('Producto no disponible')
        
        return product
        
    def exist_product(self, data):
        status = data['status']
        if status == 'unavailable':
            return True
        return False