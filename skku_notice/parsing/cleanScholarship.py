import os
from pymongo import MongoClient
from pymongo.server_api import ServerApi

uri = os.getenv("MONGO_URI")
client = MongoClient(uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("MongoDB에 성공적으로 연결되었습니다!")

    db = client["db"]
    collection = db["scholarships"]

    result = collection.delete_many({})
    print(f"Scholarships 컬렉션 초기화 완료! 삭제된 문서 수: {result.deleted_count}")

finally:
    client.close()
