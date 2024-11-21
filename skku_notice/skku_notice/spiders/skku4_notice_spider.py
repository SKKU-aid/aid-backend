import os
import json
import pymongo
import scrapy
from datetime import datetime
from urllib.parse import urlparse

class SkkuNoticeSpider(scrapy.Spider):
    name = 'skku4_notice'
    allowed_domains = ['skku.edu']
    start_urls = [
        # 의과대학
        "https://www.skkumed.ac.kr/community_notice.asp"
    ]
    notice_counts = {}  # Counter to track the number of notices processed
    max_notices = 10  # Limit the number of notices to crawl

    def __init__(self, *args, **kwargs):
        super(SkkuNoticeSpider, self).__init__(*args, **kwargs)
        self.mongo_client = pymongo.MongoClient(os.getenv("MONGO_URI"))
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
                if notice.css('dt.board-list-content-top'):
                    continue
                
                link = notice.css('dt.board-list-content-title a::attr(href)').get()
                title = notice.css('dt.board-list-content-title a::text').get(default='Title not found').strip()
                if "장학" not in title:
                    self.log(f"Skipping: not a scholarship notice ({title})")
                    continue
                department = notice.css('dd.board-list-content-info li:nth-child(2)::text').get(default='Department not found').strip()
                start_date = notice.css('dd.board-list-content-info li:nth-child(3)::text').get(default='Start date not found').strip()
                
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
                            self.log(f"Skipping: {title} (Dates match)")
                            continue
                    
                    yield response.follow(full_link, callback=self.parse_notice, meta={'title': title, 'department': department, 'start_date': start_date})
            else:
                break

    def parse_notice(self, response):
        title = response.meta.get('title', 'Title not found')
        department = response.meta.get('department', 'Department not found')
        start_date = response.meta.get('start_date', 'Start date not found')  
        
        content = response.css('div.board-view-txt *::text').getall()
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
