import re
import scrapy
import datetime

from stores.items import Product


class HomedepotSpider(scrapy.Spider):
    name = 'homedepot'

    allowed_domains = ['homedepot']
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
    log_file_name = 'logs/homedepot/log_homedepot-{today}.txt'.format(today=today)

    #
    custom_settings = {
        'LOG_FILE': log_file_name,
        'LOG_FORMAT': '%(levelname)s: %(message)s',
    }

    def __init__(self, urls):
        self._products_urls = urls
        print('INIT HOMEDEPOT')
    
    def parse(self, response):
        for url in self._products_urls:
            response = scrapy.Request(url, callback=self.prepare_product, headers=self.HEADERS, dont_filter=True)
            yield response

    def prepare_product(self, response):
        product = Product()

        response_body = response.body.decode('utf-8')

        product['store'] = self.name
        product['url'] = response.url

        product_code = response.selector.xpath("//span[@class='sku']/text()").get()
        product_code = product_code.split('#')[-1]
        product['sku'] = product_code
        product['upc'] = product_code

        product['name'] = response.selector.xpath("//h1[@class='main_header']/text()").get()
        product['brand'] = response.selector.xpath("//a[@class='marca']/text()").get()

        summary = response.selector.xpath("//div[@class='product_text']/text()").getall()
        product['summary'] = ''.join(summary).strip()

        product['description'] = response.selector.xpath("//div[@class='product_longdescription']/text()").get()

        product['department'] = response.selector.xpath("//div[@id='widget_breadcrumb']//a/text()").getall()[1]

        product['images'] = re.findall(r"https:\/\/cdn.homedepot.com.mx\/productos.*-a\d.jpg", response_body)

        characteristics = response.selector.xpath("//table[@class='tablePod tableSplit']//span/text()").getall()
        cleaned_characteristics = self.clean_characteristic(characteristics)
        parsed_characteristics = self.format_characteristics(cleaned_characteristics)
        product['characteristics'] = parsed_characteristics


        price = response.selector.xpath("//div[@class='product_price']//span[@class='price']/text()").getall()
        product['price'] = float(''.join(price).strip().replace(',', ''))

        return product

    def clean_characteristic(self, characteristics):
        cleaned_characteristics = [word.strip() for word in characteristics ]
        cleaned_characteristics = list(zip(cleaned_characteristics[0::2], cleaned_characteristics[1::2]))
        return cleaned_characteristics
    
    def format_characteristics(self, characteristics):
        parsed_characteristics = {charac[0]: charac[1] for charac in characteristics}
        return parsed_characteristics