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
        # # 소프트웨어융합대학
        # "https://sw.skku.edu/sw/notice.do?mode=list&srCategoryId1=1586&srSearchKey=&srSearchVal=#",
        # # 소프트웨어학과
        # 'https://cse.skku.edu/cse/notice.do?mode=list&srCategoryId1=1586&srSearchKey=&srSearchVal=',
        # # 글로벌융합학부
        # "https://sco.skku.edu/sco/community/notice.do?mode=list&srCategoryId1=267&srSearchKey=&srSearchVal=",
        # # 지능형소프트웨어학과
        # "https://intelligentsw.skku.edu/intelligentsw/notice.do?mode=list&srCategoryId1=1586&srSearchKey=&srSearchVal=",
        # # 글로벌바이오메디컬공학과
        # "https://gbme.skku.edu/gbme/community/under_notice.do?mode=list&srCategoryId1=158&srSearchKey=&srSearchVal=",
        
        # # 유학대학
        # "https://scos.skku.edu/scos/community/under_notice.do?mode=list&srCategoryId1=236&srSearchKey=&srSearchVal=",
        
        # # 국어국문학과
        # "https://skb.skku.edu/korean/community/under_notice.do?mode=list&srCategoryId1=777&srSearchKey=&srSearchVal=",
        # # 영어영문학과
        # "https://skb.skku.edu/english/notice.do?mode=list&srCategoryId1=267&srSearchKey=&srSearchVal=",
        # # 프랑스어문학과
        # "https://skb.skku.edu/french/community/notice.do?mode=list&srCategoryId1=158&srSearchKey=&srSearchVal=",
        # # 러시아어문학과
        # "https://russian.skku.edu/russian/deptnews.do?mode=list&srCategoryId1=267&srSearchKey=&srSearchVal=",
        # # 중어중문학과
        # "https://skb.skku.edu/chinese/undergraduate_notice.do?mode=list&srCategoryId1=236&srSearchKey=&srSearchVal=",
        # # 한문학과
        # "https://skb.skku.edu/klcc/community/under_notice.do?mode=list&srCategoryId1=158&srSearchKey=&srSearchVal=",
        # # 사학과
        # "https://history.skku.edu/history/community/under_notice.do?mode=list&srCategoryId1=158&srSearchKey=&srSearchVal=",
        # # 철학과
        # "https://skb.skku.edu/philosophy/community/under_notice.do?mode=list&srCategoryId1=158&srSearchKey=&srSearchVal=",
        # # 문헌정보학과
        # "https://lis.skku.edu/lis/community/under_notice.do?mode=list&srCategoryId1=158&srSearchKey=&srSearchVal=",
        
        # # 사회과학대학
        # "https://sscience.skku.edu/sscience/community/under_notice.do?mode=list&srCategoryId1=236&srSearchKey=&srSearchVal=",
        # # 정치외교학과
        # "https://skb.skku.edu/psd/notice.do?mode=list&srCategoryId1=1170&srSearchKey=&srSearchVal=",
        # # 미디어커뮤니케이션학과
        # "https://mediacomm.skku.edu/mediacomm/community/notice.do?mode=list&srCategoryId1=225&srSearchKey=&srSearchVal=",
        # # 심리학과
        # "https://psych.skku.edu/psy/notice_undergraduate.do?mode=list&srCategoryId1=225&srSearchKey=&srSearchVal=",
        
        # # 경제대학
        # "https://ecostat.skku.edu/ecostat/notice_under.do?mode=list&srCategoryId1=236&srSearchKey=&srSearchVal=",
        # # 통계학과
        # "https://stat.skku.edu/stat/community/under_notice.do?mode=list&srCategoryId1=158&srSearchKey=&srSearchVal=",
        # # 글로벌경제학과
        # "https://globalecon.skku.edu/gecon/notice.do?mode=list&srCategoryId1=657&srSearchKey=&srSearchVal=",
        
        # # 경영대학
        # "https://biz.skku.edu/bizskk/notice.do?mode=list&srCategoryId1=754&srSearchKey=&srSearchVal=",
        
        # # 자연과학대학
        # "https://cscience.skku.edu/cscience/community/under_notice.do?mode=list&srCategoryId1=236&srSearchKey=&srSearchVal=",
        # # 수학과
        # "https://skb.skku.edu/math/community/under_notice.do?mode=list&srCategoryId1=158&srSearchKey=&srSearchVal=",
        # # 물리학과
        # "https://physics.skku.ac.kr/physics/notice/notice.do?mode=view&articleNo=182400&article.offset=0&articleLimit=10&srCategoryId1=1340",
        
        # # 생명공학대학
        # "https://biotech.skku.edu/biotech/community/under_notice.do?mode=list&srCategoryId1=236&srSearchKey=&srSearchVal=",
        # # 식품생명공학과
        # "https://skb.skku.edu/foodlife/community/notice.do?mode=list&srCategoryId1=158&srSearchKey=&srSearchVal=",
        # # 바이오메카트로닉스학과
        # "https://skb.skku.edu/biomecha/community/notice.do?mode=list&srCategoryId1=158&srSearchKey=&srSearchVal=",
        # # 융합생명공학과
        # "https://skb.skku.edu/gene/community/under_notice.do?mode=list&srCategoryId1=158&srSearchKey=&srSearchVal=",
        
        # # 전기전자공학부
        # "https://eee.skku.edu/eee/notice.do?mode=list&srCategoryId1=267&srSearchKey=&srSearchVal=",
        # # 반도체시스템공학과
        # "https://semi.skku.edu/semi/community/notice.do?mode=list&srCategoryId1=1305&srSearchKey=&srSearchVal=",
        # # 반도체융합공학과
        # "https://sce.skku.edu/sce/notice.do?mode=list&srCategoryId1=267&srSearchKey=&srSearchVal=#a",
        # # 소재부품융합공학과
        # "https://skb.skku.edu/mcce/notice.do?mode=list&srCategoryId1=267&srSearchKey=&srSearchVal=",
        
        # # 공과대학
        # "https://enc.skku.edu/enc/community/under_notice.do?mode=list&srCategoryId1=236&srSearchKey=&srSearchVal=",
        # # 신소재공학부
        # "https://amse.skku.edu/AMSE/notice.do?mode=list&srCategoryId1=267&srSearchKey=&srSearchVal=",
        # # 기계공학부
        # "https://mech.skku.edu/me/notice.do?mode=list&srCategoryId1=267&srSearchKey=&srSearchVal=",
        # # 시스템경영공학과
        # "https://sme.skku.edu/iesys/notice.do?mode=list&srCategoryId1=1213&srSearchKey=&srSearchVal=",
        # # 건축학과
        # "https://arch.skku.edu/arch/NEWS/notice.do?mode=list&srCategoryId1=645&srSearchKey=&srSearchVal=",
        
        # # 사범대학
        # "https://coe.skku.edu/coe/community/under_notice.do?mode=list&srCategoryId1=236&srSearchKey=&srSearchVal=",
        # # 교육학과
        # "https://skb.skku.edu/skku-edu/community/under_notice.do?mode=list&srCategoryId1=158&srSearchKey=&srSearchVal=",
        # # 한문교육과
        # "https://skb.skku.edu/klccedu/community/notice.do?mode=list&srCategoryId1=1059&srSearchKey=&srSearchVal=",
        # # 수학교육과
        # "https://skb.skku.edu/mathedu/notice.do?mode=list&srCategoryId1=267&srSearchKey=&srSearchVal=",
        # # 컴퓨터교육과
        # "https://comedu.skku.edu/comedu/notice.do?mode=list&srCategoryId1=225&srSearchKey=&srSearchVal=",
        
        # # 예술대학
        # "https://art.skku.edu/art/community/under_notice.do?mode=list&srCategoryId1=236&srSearchKey=&srSearchVal=",
        # # 디자인학과
        # "https://design.skku.edu/design/notice_dept.do?mode=list&srCategoryId1=267&srSearchKey=&srSearchVal=",
        # # 무용학과
        # "https://dance.skku.edu/dance/notice.do?mode=list&srCategoryId1=267&srSearchKey=&srSearchVal=",
        # # 연기예술학과
        # "https://acting.skku.edu/acting/notice.do?mode=list&srCategoryId1=267&srSearchKey=&srSearchVal=",
        # # 의상학과
        # "https://fashion.skku.edu/fashion/notice.do?mode=list&srCategoryId1=267&srSearchKey=&srSearchVal=",
        
        # # 스포츠과학대학
        # "https://sport.skku.edu/sports/community/under_notice.do?mode=list&srCategoryId1=236&srSearchKey=&srSearchVal=",
        
        
        
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
                if "한국장학재단" in title:
                    self.log(f"Skipping: {title} (Korea Scholarship Foundation)")
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

        # Handle pagination only if the max notices limit hasn't been reached
        if self.notice_counts[base_url] < self.max_notices:
            next_page = response.css('a.page-next::attr(href)').get()
            if next_page:
                yield response.follow(next_page, callback=self.parse)

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
