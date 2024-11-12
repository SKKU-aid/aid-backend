import os
import json
from pymongo import MongoClient
from pymongo.server_api import ServerApi

uri = os.getenv("MONGO_URI")
client = MongoClient(uri, server_api=ServerApi('1'))

with open("../skku_notice/parsing/response.json", "r", encoding="utf-8") as file:
    scholarship_data = json.load(file)
    print(scholarship_data)

try:
    client.admin.command('ping')
    print("MongoDB에 성공적으로 연결되었습니다!")

    # 데이터베이스와 컬렉션 선택
    db = client["db"]  # 데이터베이스 이름을 "your_database_name"에 입력
    collection = db["scholarships"]  # 컬렉션 이름을 "your_collection_name"에 입력

    for scholarship in scholarship_data:
        scholarship["_id"] = scholarship.pop("scholarshipID")

    # MongoDB에 데이터 삽입
    if isinstance(scholarship_data, list):  # 데이터가 리스트 형태라면
        collection.insert_many(scholarship_data)
        print("데이터가 성공적으로 저장되었습니다!")
    else:
        collection.insert_one(scholarship_data)
        print("데이터가 성공적으로 저장되었습니다!")
finally:
    # 클라이언트 연결 종료
    client.close()
