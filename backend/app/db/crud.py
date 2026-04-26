from app.db.database import uploads_collection, customers_collection
from datetime import datetime
import uuid
import json

async def save_upload(file_name: str, row_count: int, summary: dict, customers: list) -> str:
    upload_id = str(uuid.uuid4())
    uploaded_at = datetime.utcnow()

    await uploads_collection.insert_one({
        "_id": upload_id,
        "fileName": file_name,
        "rowCount": row_count,
        "summary": summary,
        "uploadedAt": uploaded_at,
    })

    if customers:
        try:
            clean_customers = json.loads(json.dumps(customers))
            docs = [
                {**c, "uploadId": upload_id, "uploadedAt": uploaded_at}
                for c in clean_customers
            ]
            result = await customers_collection.insert_many(docs)
            print(f"[CRIM] Saved {len(result.inserted_ids)} customers to MongoDB")
        except Exception as e:
            print(f"[CRIM] ERROR saving customers: {e}")

    return upload_id

async def get_all_uploads():
    cursor = uploads_collection.find().sort("uploadedAt", -1)
    return await cursor.to_list(length=100)

async def get_customers_by_upload(upload_id: str):
    cursor = customers_collection.find({"uploadId": upload_id}, {"_id": 0})
    return await cursor.to_list(length=10000)

async def get_customer(upload_id: str, customer_id: str):
    """Fetch a single customer document."""
    return await customers_collection.find_one(
        {"uploadId": upload_id, "customerID": customer_id},
        {"_id": 0}
    )

async def save_recommendations(upload_id: str, customer_id: str, recommendations: list):
    """Cache recommendations in MongoDB so we never generate twice."""
    await customers_collection.update_one(
        {"uploadId": upload_id, "customerID": customer_id},
        {"$set": {"recommendations": recommendations}}
    )