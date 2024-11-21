import os
import json
import pymongo
import scrapy
from datetime import datetime
from urllib.parse import urlparse

class SkkuNoticeSpider(scrapy.Spider):
    name = 'skku3_notice'
    allowed_domains = ['skku.edu']
    start_urls = [
        # 약학대학
        "https://pharm.skku.edu/bbs/board.php?bo_table=notice&sca=&sop=and&sfl=wr_subject&stx=%EC%9E%A5%ED%95%99"
    ]
    notice_counts = {}  # Counter to track the number of notices processed
    max_notices = 10  # Limit the number of notices to crawl

    def __init__(self, *args, **kwargs):
        super(SkkuNoticeSpider, self).__init__(*args, **kwargs)
        self.mongo_client = pymongo.MongoClient(os.getenv("MONGODB_URI"))
        self.db = self.mongo_client["db"]
        self.collection = self.db["scholarships"]
    
    def closed(self, reason):
        self.mongo_client.close()
    
    def parse(self, response):
        parsed_url = urlparse(response.url)
        base_url = f"{parsed_url.scheme}://{parsed_url.netloc}{parsed_url.path}"
        if base_url not in self.notice_counts:
            self.notice_counts[base_url] = 0
            
        notices = response.css('ol.bo_lst > li')

        for notice in notices:
            if self.notice_counts[base_url] < self.max_notices:                
                link = notice.css('a::attr(href)').get()
                start_date = notice.css('span.time::text').get(default='Start date not found').strip()
                
                try:
                    _date = datetime.strptime(start_date, '%Y-%m-%d')
                except ValueError:
                    self.log(f"Invalid date format: {start_date}")
                    continue
                if (datetime.now() - _date).days > 60:
                    self.log(f"Stopping crawl for {base_url}: Start date ({start_date}) is older than 90 days.")
                    return
                
                if link:
                    full_link = response.urljoin(link)
                    self.notice_counts[base_url] += 1
                    try:
                        existing_doc = self.collection.find_one({"link": full_link})
                    except Exception as e:
                        self.log(f"Error: {e}")
                        existing_doc = None
                    if existing_doc:
                        db_start_date = existing_doc.get("applicationPeriod", "").split("~")[0].strip()
                        if start_date == db_start_date:
                            continue
                    
                    yield response.follow(full_link, callback=self.parse_notice, meta={'start_date': start_date})
            else:
                break

    def parse_notice(self, response):
        title = response.css('section#bo_view header h1::text').get(default='Title not found').strip()
        if "한국장학재단" in title:
            return
        department = "약학과"
        start_date = response.meta.get('start_date', 'Start date not found')  
        
        content = response.css('div#bo_v_con *::text').getall()
        if content:
            content = ' '.join([text.strip() for text in content if text.strip()]).replace('\xa0', ' ').replace('\r\n', ' ')
            if not content:
                content = 'Content not found'
        else:
            content = 'Content not found'

        yield {
            'title': title,
            'link': response.url,
            'department': department,
            'start_date': start_date,
            'content': content
        }
