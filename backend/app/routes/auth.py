from fastapi import APIRouter, HTTPException
from models.users import User
from app.db.database import users_collection
from app.auth.security import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter()

# SIGNUP
@router.post("/signup")
async def signup(user: User):

    existing_user = await users_collection.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="User already exists"
        )

    hashed = hash_password(user.password)

    await users_collection.insert_one({
        "email": user.email,
        "password": hashed
    })

    return {"message": "Account created successfully"}

# LOGIN
@router.post("/login")
async def login(user: User):

    db_user = await users_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"email": user.email})

    return {
        "access_token": token,
        "token_type": "bearer"
    }