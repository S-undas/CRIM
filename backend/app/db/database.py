import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = "mongodb+srv://adeelanasir06_db_user:rZPcLz9qhQnKFnqq@cluster0.e1qzarl.mongodb.net/?appName=Cluster0"
DB_NAME = os.getenv("DB_NAME", "crim")

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DB_NAME]

# Collections
uploads_collection = db["uploads"]
customers_collection = db["customers"]
users_collection = db["users"]