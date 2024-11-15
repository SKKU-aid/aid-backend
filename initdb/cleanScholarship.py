import os
from pymongo import MongoClient
from pymongo.server_api import ServerApi

# MongoDB URI 환경 변수에서 가져오기
uri = os.getenv("MONGO_URI")
client = MongoClient(uri, server_api=ServerApi('1'))

try:
    # MongoDB 연결 확인
    client.admin.command('ping')
    print("MongoDB에 성공적으로 연결되었습니다!")

    # DB 및 컬렉션 설정
    db = client["db"]
    collection = db["scholarships"]

    # 기존 데이터 초기화 (모든 문서 삭제)
    result = collection.delete_many({})
    print(f"Scholarships 컬렉션 초기화 완료! 삭제된 문서 수: {result.deleted_count}")

finally:
    # 클라이언트 연결 종료
    client.close()
