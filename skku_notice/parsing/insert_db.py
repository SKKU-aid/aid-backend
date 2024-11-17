import os
import json
from pymongo import MongoClient
from pymongo.server_api import ServerApi

uri = os.getenv("MONGO_URI")
client = MongoClient(uri, server_api=ServerApi('1'))

with open("./response.json", "r", encoding="utf-8") as file:
    scholarship_data = json.load(file)

try:
    client.admin.command('ping')
    print("MongoDB에 성공적으로 연결되었습니다!")

    db = client["db"]
    collection = db["scholarships"]

    max_id_document = collection.find_one(sort=[("_id", -1)])
    max_id = max_id_document["_id"] if max_id_document else 0

    print(f"Current max _id in database: {max_id}")
    
    for idx, scholarship in enumerate(scholarship_data, start=1):
        scholarship["_id"] = idx
            
    for scholarship in scholarship_data:
        max_id += 1
        scholarship["_id"] = max_id

        try:
            collection.insert_one(scholarship)
            print(f"Inserted: {scholarship['_id']}")
        except Exception as e:
            print(f"Error inserting {scholarship['_id']}: {e}")
finally:
    client.close()
