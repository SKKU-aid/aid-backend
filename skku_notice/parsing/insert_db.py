import os
import json
from pymongo import MongoClient
from pymongo.server_api import ServerApi

uri = os.getenv("MONGO_URI")
client = MongoClient(uri, server_api=ServerApi('1'))

current_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(current_dir, "response.json")
with open(file_path, "r", encoding="utf-8") as file:
    scholarship_data = json.load(file)

try:
    client.admin.command('ping')
    print("MongoDB에 성공적으로 연결되었습니다!")

    db = client["db"]
    collection = db["scholarships"]

    max_id_document = collection.find_one(sort=[("_id", -1)])
    max_id = max_id_document["_id"] if max_id_document else 0

    print(f"Current max _id in database: {max_id}")
            
    for scholarship in scholarship_data:
        # Find if there's an existing document with the same link
        existing_doc = collection.find_one({"link": scholarship["link"]})
        
        if existing_doc:
            if existing_doc["applicationPeriod"] == scholarship["applicationPeriod"]:
                # Same applicationPeriod, do not add
                print(f"Duplicate found with same applicationPeriod for link: {scholarship['link']}, skipping...")
                continue  # Skip to next scholarship
            else:
                # Different applicationPeriod, overwrite the data at that _id
                scholarship["_id"] = existing_doc["_id"]
                try:
                    collection.replace_one({"_id": existing_doc["_id"]}, scholarship)
                    print(f"Updated scholarship with _id {existing_doc['_id']}")
                except Exception as e:
                    print(f"Error updating scholarship with _id {existing_doc['_id']}: {e}")
        else:
            # No existing document with the same link, insert as new document
            max_id += 1
            scholarship["_id"] = max_id
            try:
                collection.insert_one(scholarship)
                print(f"Inserted new scholarship with _id {scholarship['_id']}")
            except Exception as e:
                print(f"Error inserting new scholarship with _id {scholarship['_id']}: {e}")
finally:
    client.close()
