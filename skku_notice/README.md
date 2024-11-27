# SKKU Notice Crawler & Parser

This module is responsible for scraping notices from SKKU websites and parsing the data for further processing.

## How to Use Scrapy (scrap)

1. Open `.\skku_notice\skku_notice\spiders\skku_notice_spider.py`.
2. Set the `start_urls` variable to the domain you want to scrape.
3. Adjust `max_notices` to control the number of notices to scrape.
4. Run the following command to start scraping:
    ```bash
    cd skku_notice
    chmod +x crawl_script.sh
    ./crawl_script.sh
    ```
5. The scraped results will be stored in `notices.json`.

## How to Use LangChain for Parsing

1. Ensure your `.env` file is correctly configured with your API keys and MongoDB URI.  
2. Use the following script to parse the crawled data using LangChain:  
    ```bash
    python3 parsing/parsing_notices.py
    ```  
3. Save the parsed data (`response.json`) to the database:  
    ```bash
    python3 parsing/insert_db.py
    ```  

**Note:** Make sure to verify the contents of `response.json` before running the database insertion script to ensure accuracy.

