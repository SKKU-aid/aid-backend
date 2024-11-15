#!/bin/bash

# Step 1: Run the first Scrapy crawl and save to notices.json
echo "Running first Scrapy crawl..."
scrapy crawl skku_notice -o notices.json

# Step 2: Run the second Scrapy crawl and append to notices.json
echo "Running second Scrapy crawl..."
scrapy crawl math_notice -o notices.json

# Step 3: Merge the notices using the Python script
echo "Merging notices using mergeNotice.py..."
python3 mergeNotice.py
