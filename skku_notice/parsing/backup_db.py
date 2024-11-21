import os
import json
from pymongo import MongoClient
from pymongo.server_api import ServerApi

# MongoDB 연결 설정
uri = os.getenv("MONGO_URI")
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["db"]
collection = db["scholarships"]

# 백업 파일 경로
backup_file_path = "db_backup.json"

try:
    client.admin.command('ping')
    print("MongoDB에 성공적으로 연결되었습니다!")

    # **1. 모든 문서 가져오기**
    documents = list(collection.find())

    # **2. MongoDB ObjectId 변환 (JSON 직렬화 문제 해결)**
    for doc in documents:
        doc['_id'] = str(doc['_id'])  # ObjectId를 문자열로 변환

    # **3. JSON 파일로 저장**
    with open(backup_file_path, "w", encoding="utf-8") as backup_file:
        json.dump(documents, backup_file, indent=4, ensure_ascii=False)

    print(f"백업이 완료되었습니다: {backup_file_path}")

except Exception as e:
    print(f"오류 발생: {e}")

finally:
    client.close()
