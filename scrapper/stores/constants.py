''' API '''

# Base URL for make API calls
# SERVER_URL = 'https://carlos-carvacrack.ddns.net:5002'
SERVER_URL = 'http://carlos-carvacrack.ddns.net'


''' Stablished API Calls for ServerPipeline

    Variables:
        LOGIN_CALL
        UPDATE_TOKE_CALL
        CHECK_TOKEN_CALL
 '''
# API Calls
LOGIN_CALL =  SERVER_URL + '/modular/api/v1/oauth/login'
UPDATE_TOKEN_CALL =  SERVER_URL + '/modular/api/v1/oauth/update-token'
CHECK_TOKEN_CALL = SERVER_URL + '/modular/api/v1/oauth/verify-token'


# Product API Calls
ADD_PRODUCT_CALL =  SERVER_URL + '/modular/api/v1/product/scrap'
UPDATE_PRODUCT_CALL =   SERVER_URL + '/modular/api/v1/product/3'
GET_ALL_PRODUCT_CALL =  SERVER_URL + '/modular/api/v1/product?limit=10000000&offset=0'


''' 
    Constants used in sitemap.py. 
    
    Variables:
        STORE_URLS
        KEYWORD
        HEADERS
'''

STORE_URLS = {'walmart': 'https://www.walmart.com.mx/sitemap.xml',
              'sams': 'https://www.sams.com.mx/siteindex.xml',
              'liverpool': 'https://www.liverpool.com.mx/Sitemap/index.xml',
              'costco': 'https://www.costco.com.mx/sitemap.xml',
              'elektra': 'https://www.elektra.com.mx/sitemap.xml',
              'homedepot': 'https://www.homedepot.com.mx/sitemap_10351.xml'}

KEYWORD = {'walmart': 'product',
           'sams': 'product',
           'liverpool': 'detail',
           'costco': 'product',
           'elektra': 'product',
           'homedepot': 'sitemap'}

HEADERS = {'accept': 'application/json, text/javascript, */*; q=0.01',
           'accept-encoding': 'gzip, deflate, br',
           'accept-language': 'es-419,es;q=0.9',
           'sec-ch-ua': '?0',
           'sec-fetch-dest': 'empty',
           'sec-fetch-mode': 'cors',
           'sec-fetch-site': 'same-origin',
           'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36 OPR/74.0.3911.107',
           'x-requested-with': 'XMLHttpRequest'}

LIVERPOOL_SERVICE_PAYLOAD = {'accept': 'application/json, text/plain, */*',
                             'accept-encoding': 'gzip, deflate, br',
                             'Accept-Language': 'en-US,en;q=0.5',
                             'Content-Length': '505',
                             'Content-Type': 'application/json;charset=utf-8',
                             'Host': 'www.liverpool.com.mx',
                             'Origin': 'https://www.liverpool.com.mx',
                             'Referer': '',
                             'sec-fetch-dest': 'empty',
                             'sec-fetch-mode': 'cors',
                             'sec-fetch-site': 'same-origin',
                             'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36 OPR/74.0.3911.107'}