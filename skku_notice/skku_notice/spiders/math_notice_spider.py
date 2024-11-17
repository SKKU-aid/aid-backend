import scrapy

class SkkuNoticeSpider(scrapy.Spider):
    name = 'math_notice'
    allowed_domains = ['skku.edu']
    start_urls = [
        'https://skb.skku.edu/math/community/under_notice.do?mode=list&srCategoryId1=158&srSearchKey=&srSearchVal='
    ]
    notice_count = 0  # Counter to track the number of notices processed
    max_notices = 10  # Limit the number of notices to crawl

    def parse(self, response):
        # Extract notices, excluding the ones with "board-list-content-top"
        notices = response.css('dt.board-list-content-title:not(.board-list-content-top)')
        
        # Extract views for notices
        views = response.css('span.board-mg-l10::text').getall()

        for i, notice in enumerate(notices):
            if self.notice_count < self.max_notices:
                # Get the link of the notice
                link = notice.css('a::attr(href)').get()
                if link:
                    full_link = response.urljoin(link)
                    self.notice_count += 1
                    # Pass the corresponding view count using meta
                    yield response.follow(full_link, callback=self.parse_notice, meta={'views': views[i]})
            else:
                break

        # Handle pagination only if the max notices limit hasn't been reached
        if self.notice_count < self.max_notices:
            next_page = response.css('a.page-next::attr(href)').get()
            if next_page:
                yield response.follow(next_page, callback=self.parse)

    def parse_notice(self, response):
        title = response.css('div.board-view-title-wrap h4::text').getall()
        if title:
            title = ' '.join([t.strip() for t in title]).strip()
        else:
            title = 'Title not found'
        
        content = response.css('div.fr-view *::text').getall()
        if content:
            content = ' '.join([text.strip() for text in content if text.strip()]).replace('\xa0', ' ').replace('\r\n', ' ')
        else:
            content = 'Content not found'
        start_date = response.css('ul.board-etc-wrap li:nth-child(3)::text').get(default='Start date not found').strip()
        views = response.meta.get('views', 'Views not found')

        yield {
            'title': title,
            'link': response.url,
            'start_date': start_date,
            'views': views,
            'content': content
        }
