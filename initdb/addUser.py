import os
import json
from pymongo import MongoClient
from pymongo.server_api import ServerApi

# MongoDB URI 환경 변수에서 가져오기
uri = os.getenv("MONGO_URI")
client = MongoClient(uri, server_api=ServerApi('1'))

# users.json 파일 읽기
with open("./users.json", "r", encoding="utf-8") as file:
    users_data = json.load(file)

try:
    # MongoDB 연결 확인
    client.admin.command('ping')
    print("MongoDB에 성공적으로 연결되었습니다!")

    # DB 및 컬렉션 설정
    db = client["db"]
    collection = db["users"]

    # 데이터 삽입
    if isinstance(users_data, list):
        collection.insert_many(users_data)
        print("Users 데이터가 성공적으로 저장되었습니다!")
    else:
        collection.insert_one(users_data)
        print("Users 데이터가 성공적으로 저장되었습니다!")
finally:
    # 클라이언트 연결 종료
    client.close()
