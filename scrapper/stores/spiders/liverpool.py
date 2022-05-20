import re
import json
import scrapy
import datetime
# from items import Product
from stores.items import Product

''' Liverpool Spider huehuehue

    Attributes:
        name
        allowed_domains
        start_urls
        HEADERS
'''

class LiverpoolSpider(scrapy.Spider):
    name = 'liverpool'
    allowed_domains = ['liverpool']
    start_urls = ['https://www.google.com/']
    
    HEADERS = {'accept': 'application/json, text/plain, */*',
               'accept-encoding': 'gzip, deflate, br',
               'accept-language': 'es-419, es',
               'origin': 'https://www.google.com/',
               'referer': 'https://www.google.com/',
               'sec-fetch-dest': 'empty',
               'sec-fetch-mode': 'cors',
               'sec-fetch-site': 'same-origin',
               'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36 OPR/73.0.3856.257',
               'user-correlation-id': 'LP-WEB-14fb5599-6f32-4fd1-83ff-252eaaaa17f0',
               'x-correlation-id': 'LP-WEB-14fb5599-6f32-4fd1-83ff-252eaaaa17f0'}
    
    # 
    today = datetime.date.today()
    log_file_name = 'logs/liverpool/log_liverpool-{today}.txt'.format(today=today)

    custom_settings = {
        'LOG_FILE': log_file_name,
        'LOG_FORMAT': '%(levelname)s: %(message)s',
    }

    def __init__(self, urls):
        self._products_urls = urls

    def parse(self, response):
        for url in self._products_urls:
            response = scrapy.Request(
                url, callback=self.prepare_product, headers=self.HEADERS, dont_filter=True)
            yield response

    def prepare_product(self, response):
        product = Product()
        raw_data = self.parse_response(response)

        if len(raw_data) == 0:
            print('Producto no disponible')

        else:
            json_data = json.loads(raw_data[0])
            
            general_data = json_data['query']['data']['mainContent']['records'][0]['allMeta']
            product_data = general_data['variants'][0]
            # Definimos los atributos del JSON
            product['store'] = self.name
            product['url'] = response.url
            product['sku'] = product_data['skuId']
            product['upc'] = product_data['skuId']
            product['name'] = general_data['title']
            product['brand'] = ''.join([item['brandname'][0] for item in general_data['dynamicFacets'] if 'brandname' in item.keys() ])            
            
            try:    
                product['description'] = general_data['productDescription']
                product['summary'] = product['description'].split('.')[0]
            except:
                product['description'] = ''
                product['summary'] = ''
            
            product['images'] = product_data['galleriaImages']

            characteristics = ''.join(general_data['dynamicAttributes'])
            cleaned_characteristics = self.clean_characteristics(characteristics)
            cleaned_characteristics = list(zip(cleaned_characteristics[0::2], cleaned_characteristics[1::2]))
            product['characteristics'] = {charac[0]: charac[1] for charac in cleaned_characteristics}
            
            if len(general_data['variants']) > 1:
                charact_variants = self.extract_variants(general_data['variants'])
                product['characteristics']['variants'] = charact_variants

            departments = list(general_data['categories'][-1].values())
            product['department'] = departments[-1]

            product['price'] = self.select_price(product_data['prices'])

        return product


    def parse_response(self, response):

        # Seleccionamos el "JSON" dentro del response
        selector = response.selector.xpath("//script[@id='__NEXT_DATA__']").get()
        # Aplicamos una regex para encontrar todos los atributos que inicien con 'sku' o 'product'
        raw_data = re.findall(
            r"(\"(sku|product)\.?\w+\":\[\"(.*?)\"\])", selector, flags=re.M)
        
        # Limpiamos la información extraída
        raw_data = [item[0].replace('[', '').replace(']', '').split(':') for item in raw_data]
        
        raw_data = re.findall(r"<script.*>(.*?)<\/script>", selector, flags=re.M)

        return raw_data
    
    def clean_characteristics(self, characteristics):
        splitted_characteristics = characteristics.split('|')
        cleaned_characteristics = []
        for charac in splitted_characteristics:
            tmp = re.findall(r"\w.*?.*(?<!\d)", charac)
            cleaned_characteristics.append(''.join(tmp))
        return cleaned_characteristics[1:]

    def select_price(self, prices):
        price = 0
        discount = float(prices['discountPercentage'])
        if discount > 0:
            price = float(prices['promoPrice'])
        else:
            price = float(prices['salePrice'])
        return price

    def extract_variants(self, variants):
        charact_variants = []
        for variant in variants:
            charact_variant = self.parse_variant(variant)
            charact_variants.append(charact_variant)
        return charact_variants

    def parse_variant(self, variant):
        charact_variant = {}
        if self.is_variant_available(variant):
            try:
                charact_variant['color'] = variant['color']
                charact_variant['price'] = self.select_price(variant['prices'])
                charact_variant['size'] = variant['size']
            except:
                pass
        return charact_variant
    
    def is_variant_available(self, variant):
        available = False
        try:
            value = variant['hasValidOnlineInventory']
            available = True if value == 'true' else False
        except:
            pass
        return available