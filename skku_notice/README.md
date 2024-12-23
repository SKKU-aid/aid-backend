# SKKU Notice Crawler & Parser

This module is responsible for scraping notices from SKKU websites and parsing the data for further processing.

## How to Use Scrapy (Scrap)

> **Optional Configuration (Steps 1–3)**  
> If you do not need to change the default scraping settings, you can skip these steps.

1. (Optional) Open `skku_notice/skku_notice/spiders/skku*_notice_spider.py`.  
2. (Optional) Modify the `start_urls` variable to point to the domain you want to scrape.  
3. (Optional) Adjust `max_notices` to control the number of notices to scrape.

**Scraping Execution**  
Run the following commands to start scraping:
```bash
cd skku_notice
chmod +x crawl_script.sh
./crawl_script.sh
```
The scraped results will be stored in `notices.json`.

---

## How to Use LangChain for Parsing

1. **Check Your `.env` File**  
   - Make sure it contains valid API keys for LangChain or any other LLM services.  
   - Ensure the MongoDB URI matches the one mentioned in the [../README.md](../README.md).
   - If you do not have the necessary keys, please contact the project administrator.
   - Below is an example .env structure:
     ```bash
     # .env
     OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     ```

2. **Parse Crawled Data**  
   Use the following script to parse the crawled data:
   ```bash
   python3 parsing/parsing_notices.py
   ```
   This will generate `response.json`.

3. **Insert Parsed Data into the Database**  
   Before inserting, verify the contents of `response.json`. Then run:
   ```bash
   python3 parsing/insert_db.py
   ```

**Note:** Always check the contents of `response.json` before running the database insertion script to ensure data accuracy.
