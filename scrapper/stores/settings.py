# Scrapy settings for stores project
#
# For simplicity, this file contains only settings considered important or
# commonly used. You can find more settings consulting the documentation:
#
#     https://docs.scrapy.org/en/latest/topics/settings.html
#     https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
#     https://docs.scrapy.org/en/latest/topics/spider-middleware.html

BOT_NAME = 'stores'

SPIDER_MODULES = ['stores.spiders']
NEWSPIDER_MODULE = 'stores.spiders'


# Crawl responsibly by identifying yourself (and your website) on the user-agent
#USER_AGENT = 'stores (+http://www.yourdomain.com)'

# Obey robots.txt rules
ROBOTSTXT_OBEY = False

# Configure maximum concurrent requests performed by Scrapy (default: 16)
# CONCURRENT_REQUESTS = 64

MEMUSAGE_LIMIT_MB = 4096

# Configure a delay for requests for the same website (default: 0)
# See https://docs.scrapy.org/en/latest/topics/settings.html#download-delay
# See also autothrottle settings and docs
DOWNLOAD_DELAY = 0.25
# The download delay setting will honor only one of:
#CONCURRENT_REQUESTS_PER_DOMAIN = 16
#CONCURRENT_REQUESTS_PER_IP = 16

# Disable cookies (enabled by default)
#COOKIES_ENABLED = False

# Disable Telnet Console (enabled by default)
#TELNETCONSOLE_ENABLED = False

# Override the default request headers:
# DEFAULT_REQUEST_HEADERS = {
#     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'
# }

# Enable or disable spider middlewares
# See https://docs.scrapy.org/en/latest/topics/spider-middleware.html
SPIDER_MIDDLEWARES = {
   'stores.middlewares.StoresSpiderMiddleware': 543,
#    'scrapy.downloadermiddlewares.retry.RetryMiddleware': None, 
#    'stores.middlewares.SleepRetryMiddleware': 100,
}

# Retry many times since proxies often fail
RETRY_TIMES = 3
# Retry on most error codes since proxies fail for different reasons
RETRY_HTTP_CODES = [500, 503, 504, 400, 403, 404, 408]

# Enable or disable downloader middlewares
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
DOWNLOADER_MIDDLEWARES = {
   'scrapy.downloadermiddlewares.retry.RetryMiddleware': None,
   'stores.middlewares.SleepRetryMiddleware': 100,
    # 'scrapy_proxies.RandomProxy': 100,
    # 'scrapy.downloadermiddlewares.httpproxy.HttpProxyMiddleware': 110,
    # 'stores.middlewares.StoresDownloaderMiddleware': 120,
   # 'stores.middlewares.StoresSpiderMiddleware': 120
}

# PROXY_SETTINGS = {
#   # Proxy list containing entries like
#   # http://host1:port
#   # http://username:password@host2:port
#   # http://host3:port
#   # ...
#   # if PROXY_SETTINGS[from_proxies_server] = True , proxy_list is server address (ref https://github.com/qiyeboy/IPProxyPool and https://github.com/awolfly9/IPProxyTool )
#   # Only support http(ref https://github.com/qiyeboy/IPProxyPool#%E5%8F%82%E6%95%B0)
#   # list : ['http://localhost:8000?protocol=0'],
#   'list':['X:\\aleja\\Documents\\Jobs\\Enchingue\\Bowie-Scrapers\\list.txt'],

#   # disable proxy settings and  use real ip when all proxies are unusable
#   'use_real_when_empty':False,
#   'from_proxies_server':False,

#   # If proxy mode is 2 uncomment this sentence :
#   # 'custom_proxy': "http://host1:port",

#   # Proxy mode
#   # 0 = Every requests have different proxy
#   # 1 = Take only one proxy from the list and assign it to every requests
#   # 2 = Put a custom proxy to use in the settings
#   'mode':0
# }

# Enable or disable extensions
# See https://docs.scrapy.org/en/latest/topics/extensions.html
# EXTENSIONS = {
#    'scrapy.extensions.telnet.TelnetConsole': None,
# }

# Configure item pipelines
# See https://docs.scrapy.org/en/latest/topics/item-pipeline.html
ITEM_PIPELINES = {
   # 'stores.pipelines.JsonPipeline': 100
   'stores.pipelines.ServerPipeline': 100
}

# Enable and configure the AutoThrottle extension (disabled by default)
# See https://docs.scrapy.org/en/latest/topics/autothrottle.html
#AUTOTHROTTLE_ENABLED = True
# The initial download delay
#AUTOTHROTTLE_START_DELAY = 5
# The maximum download delay to be set in case of high latencies
#AUTOTHROTTLE_MAX_DELAY = 60
# The average number of requests Scrapy should be sending in parallel to
# each remote server
#AUTOTHROTTLE_TARGET_CONCURRENCY = 1.0
# Enable showing throttling stats for every response received:
#AUTOTHROTTLE_DEBUG = False

# Enable and configure HTTP caching (disabled by default)
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html#httpcache-middleware-settings
#HTTPCACHE_ENABLED = True
#HTTPCACHE_EXPIRATION_SECS = 0
#HTTPCACHE_DIR = 'httpcache'
#HTTPCACHE_IGNORE_HTTP_CODES = []
#HTTPCACHE_STORAGE = 'scrapy.extensions.httpcache.FilesystemCacheStorage'