from app.db.database import uploads_collection, customers_collection
from datetime import datetime
import uuid

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
        docs = [
            {**c, "uploadId": upload_id, "uploadedAt": uploaded_at}
            for c in customers
        ]
        await customers_collection.insert_many(docs)

    return upload_id

async def get_all_uploads():
    cursor = uploads_collection.find().sort("uploadedAt", -1)
    return await cursor.to_list(length=100)

async def get_customers_by_upload(upload_id: str):
    cursor = customers_collection.find({"uploadId": upload_id}, {"_id": 0})
    return await cursor.to_list(length=10000)