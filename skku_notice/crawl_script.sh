#!/bin/bash

rm -f notices.json

# Run all spiders
scrapy crawl skku1_notice -o notices.json
scrapy crawl skku2_notice -o notices.json
scrapy crawl skku3_notice -o notices.json
scrapy crawl skku4_notice -o notices.json

# Merge notices
python3 mergeNotice.py
