
# 스꾸장학비서

## Overview

TBD

## How to Run

mongodb with local host
```bash
docker-compose up -d
docker exec -it backend bash
```
http://localhost:8081

### How to Use Scrapy (scrap)

1. Open `.\skku_notice\skku_notice\spiders\skku_notice_spider.py`.
2. Set the `start_urls` variable to the domain you want to scrape.
3. Adjust `max_notices` to control the number of notices to scrape.
4. Run the following command to start scraping:
    ```bash
    cd skku_notice
    <!-- scrapy crawl skku_notice -o notices.json -->
    chmod +x crawl_script.sh
    ./crawl_script.sh
    ```
5. The scraped results will be stored in notices.json.

### How to Use LangChain for Parsing
1. Ensure your `.env` file is correctly configured with your API keys and MongoDB URI.
2. Start the Jupyter Notebook server and navigate to the following script:
    ```bash
    docker run -it --name jupyter-container \
        -p 8888:8888 \
        -v "$(pwd)":/app \
        aid-backend-image \
        /bin/bash -c "source /usr/local/app/venv/bin/activate && jupyter notebook --ip=0.0.0.0 --no-browser --allow-root"
    ```
    Open the `skku_notice\parsing\langchain_script.ipynb` notebook to initiate the parsing process.
3. Run each cell in the notebook to process and structure the scraped data into a MongoDB-compatible JSON format.


## License

TBD

## Backend Developer

2024 Fall SKKU SE CLASS 42 TEAM 10 Backend developer

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/JihunSKKU">
        <img src="https://github.com/JihunSKKU.png" width="60px;" alt="JihunSKKU"/>
        <br />
        <sub><b>Jihun Kim</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/kdonghyun13">
        <img src="https://github.com/kdonghyun13.png" width="60px;" alt="kdonghyun13"/>
        <br />
        <sub><b>Donghyun Kim</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/ohsj3781">
        <img src="https://github.com/ohsj3781.png" width="60px;" alt="ohsj3781"/>
        <br />
        <sub><b>Seungjae Oh</b></sub>
      </a>
    </td>
  </tr>
</table>
