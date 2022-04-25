import re
import scrapy
import datetime

from stores.items import Product

class CostcoSpider(scrapy.Spider):
    name = 'costco'

    allowed_domains = ['costco']
    start_urls = ['https://www.google.com/']

    HEADERS = {'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
               'accept-encoding': 'gzip, deflate, br',
               'accept-language': 'es-419,es;q=0.9',
               'sec-fetch-dest': 'document',
               'sec-fetch-mode': 'navigate',
               'sec-fetch-site': 'none',
               'sec-gpc': '1',
               'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36 OPR/74.0.3911.107'}

    # 
    today = datetime.date.today()
    log_file_name = 'logs/costco/log_costco-{today}.txt'.format(today=today)

    #
    custom_settings = {
        'LOG_FILE': log_file_name,
        'LOG_FORMAT': '%(levelname)s: %(message)s',
    }

    def __init__(self, urls):
        self._products_urls = urls
        print('INIT\t', self._products_urls)

    def parse(self, response):
        for url in self._products_urls:
            response = scrapy.Request(
                url, callback=self.prepare_product, headers=self.HEADERS, dont_filter=True)
            yield response

    def prepare_product(self, response):
        product = Product()

        if self.is_available(response):
            product['store'] = self.name
            product['url'] = response.url
            product['sku'] = response.selector.xpath("//span[@class='notranslate']/text()[last()]").get()
            product['upc'] = response.selector.xpath("//span[@class='notranslate']/text()[last()]").get()
            product['name'] = response.selector.xpath("//*[@class='product-name']/text()").get()
            product['images'] = [img.attrib['data-src'] for img in response.selector.xpath("//div[@class='gallery-carousel-wrapper']//img")]

            # No todos tienen el summary - condicial 
            summary = response.selector.xpath("//div[@class='product-information-text']/text()").getall()
            product['summary'] = '\n'.join(summary)

            description = response.selector.xpath("//div[@class='product-details-content-wrapper']//p/text()").getall()
            product['description'] = ' '.join(description[1:]).replace('\n', '')
            
            product['department'] = response.selector.xpath("//ol[@class='breadcrumb']//a/text()").getall()[1]

            characteristics = response.selector.xpath("//div[@class='product-classifications']//*/text()").getall()
            characteristics = [re.findall(r"[A-Z0-9_ ].*$", c) for c in characteristics]
            characteristics = self.clean_characteristics(characteristics)
            cleaned_characteristics = list(zip(characteristics[0::2], characteristics[1::2]))
            product['characteristics'] = self.format_characteristics(cleaned_characteristics)

            # Algunos tienen descuentos - validar tipo de precio
            price = response.selector.xpath("//div[@class='price-after-discount']//span[@class='you-pay-value']/text()").get()
            if price == None:
                price = response.selector.xpath("//div[@class='price-original']//span[@class='notranslate']/text()").get()
            product['price'] = float(re.findall(r"\d*\.?\d+", price.replace(',', ''))[0])

            product['brand'] = product['characteristics']['Marca']
        
        else:
            print('Producto no disponible')
        
        return product


    def clean_characteristics(self, characteristics):
        clean_characteristics = []
        characteristics = [c for c in characteristics[1:] if c != ['General']]
        for i, charac in enumerate(characteristics):
            if charac:
                clean_characteristics.append(charac[0])
        return clean_characteristics
    
    def format_characteristics(self, characteristics):
        parsed_characteristics = {charac[0]: charac[1] for charac in characteristics}
        return parsed_characteristics
    
    def is_available(self, response):
        is_available = response.selector.xpath("//form[@id='addToCartForm']//button[@disabled]").get()
        is_available = False if is_available else True
        return is_available