import os
import json
import pymongo
import scrapy
from datetime import datetime
from urllib.parse import urlparse

class SkkuNoticeSpider(scrapy.Spider):
    name = 'skku1_notice'
    allowed_domains = ['skku.edu']
    start_urls = [
        'https://www.skku.edu/skku/campus/skk_comm/notice06.do',
    ]
    notice_counts = {}  # Counter to track the number of notices processed
    max_notices = 30  # Limit the number of notices to crawl

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
            
        notices = response.css('ul.board-list-wrap > li')
        for notice in notices:
            if self.notice_counts[base_url] < self.max_notices:
                link = notice.css('dt.board-list-content-title a::attr(href)').get()
                title = notice.css('dt.board-list-content-title a::text').get(default='Title not found').strip()
                start_date = notice.css('dd.board-list-content-info li:nth-child(3)::text').get(default='Start date not found').strip()
                
                try:
                    _date = datetime.strptime(start_date, '%Y-%m-%d')
                except ValueError:
                    self.log(f"Invalid date format: {start_date}")
                    continue
                if (datetime.now() - _date).days > 60:
                    self.log(f"Stopping crawl for {base_url}: Start date ({start_date}) is older than 60 days.")
                    return
                    
                if link:
                    partial_link = link.split('?')[0]
                    if "articleNo" in link:
                        partial_link += '?' + '&'.join(
                            [param for param in link.split('?')[1].split('&') if param.startswith('mode') or param.startswith('articleNo')]
                        )
                    
                    full_link = response.urljoin(partial_link)
                    self.notice_counts[base_url] += 1
                    try:
                        existing_doc = self.collection.find_one({"link": full_link})
                    except Exception as e:
                        self.log(f"Error: {e}")
                        existing_doc = None
                    if existing_doc:
                        db_start_date = existing_doc.get("applicationPeriod", "").split("~")[0].strip()
                        if start_date == db_start_date:
                            self.log(f"Skipping: {title} (Dates match)")
                            continue
                    
                    yield response.follow(full_link, callback=self.parse_notice, meta={'title': title, 'start_date': start_date})
            else:
                break
            
        if self.notice_counts[base_url] < self.max_notices:
            next_page = response.css('a.pg_next::attr(href)').get()
            if next_page:
                yield response.follow(next_page, callback=self.parse)

    def parse_notice(self, response):
        title = response.meta.get('title', 'Title not found')
        start_date = response.meta.get('start_date', 'Start date not found')           
        content = response.css('pre.pre::text').get(default='Content not found').replace('\r\n', ' ').strip()
            
        yield {
            'title': title,
            'link': response.url,
            'start_date': start_date,
            'content': content
        }
