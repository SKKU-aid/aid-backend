import os
from pymongo import MongoClient
from pymongo.server_api import ServerApi

# 환경 변수에서 MongoDB URI 가져오기
uri = os.getenv("MONGO_URI")

# MongoClient 생성
client = MongoClient(uri, server_api=ServerApi('1'))

try:
    # 서버 연결 확인
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
finally:
    # 클라이언트 연결 종료
    client.close()
