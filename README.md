# 스꾸장학비서

## Overview

TBD

## How to Use Scrapy in This Project

1. Open `.\skku_notice\skku_notice\spiders\skku_notice_spider.py`.
2. Set the `start_urls` variable to the domain you want to scrape.
3. Adjust `max_notices` to control the number of notices to scrape.
4. Run the following command to start scraping:
    ```bash
    cd skku_notice
    scrapy crawl skku_notice -o notices.json
    ```
5. The scraped results will be stored in notices.json.


## How to Run

```bash
git clone https://github.com/JihunSKKU/skku_scholarship_assistant.git
cd skku_scholarship_assistant
docker build -t ssa_image .
docker run -it -v "$(pwd):/app" --name ssa_container ssa_image
```

OR if the Docker image and container have already been created:

```bash
docker run ssa_container
docker exec -it ssa_container bash
```

mongodb with local host
```bash
docker-compose up -d
```
http://localhost:8081

TBD

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
