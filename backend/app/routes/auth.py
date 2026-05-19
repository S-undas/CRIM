from dotenv import load_dotenv
load_dotenv()

from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta

from models.users import User
from app.db.database import users_collection
from app.auth.security import (
    hash_password,
    verify_password,
    create_access_token,
    generate_verification_token,
    generate_reset_token,
)
from app.auth.email_utils import (
    send_verification_email,
    send_password_reset_email,
)

router = APIRouter()


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


# ─────────────────────────────────────────────
# SIGNUP
# ─────────────────────────────────────────────
@router.post("/signup")
async def signup(user: User):
    existing = await users_collection.find_one({"email": user.email})

    if existing:
        raise HTTPException(status_code=409, detail="User already exists")

    await users_collection.insert_one({
        "email": user.email,
        "password": hash_password(user.password),
        "is_verified": True,
        "verification_token": None,
        "verification_token_expiry": None,
        "reset_token": None,
        "reset_token_expiry": None,
    })

    return {"message": "Account created successfully. You can now log in."}

# ─────────────────────────────────────────────
# VERIFY EMAIL
# ─────────────────────────────────────────────

@router.get("/verify-email")
async def verify_email(token: str):
    user = await users_collection.find_one({"verification_token": token})

    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired verification link")

    if user.get("is_verified"):
        return {"message": "Email already verified. You can log in."}

    expiry = user.get("verification_token_expiry")
    if expiry and datetime.utcnow() > expiry:
        raise HTTPException(status_code=400, detail="Verification link has expired. Please sign up again.")

    await users_collection.update_one(
        {"email": user["email"]},
        {"$set": {
            "is_verified": True,
            "verification_token": None,
            "verification_token_expiry": None,
        }}
    )

    return {"message": "Email verified successfully! You can now log in."}


# ─────────────────────────────────────────────
# LOGIN
# ─────────────────────────────────────────────
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

# ─────────────────────────────────────────────
# FORGOT PASSWORD
# ─────────────────────────────────────────────

@router.post("/forgot-password")
async def forgot_password(body: ForgotPasswordRequest):
    user = await users_collection.find_one({"email": body.email})

    if not user:
        return {"message": "If that email is registered, a reset link has been sent."}

    reset_token = generate_reset_token()
    expiry = datetime.utcnow() + timedelta(hours=1)

    await users_collection.update_one(
        {"email": body.email},
        {"$set": {
            "reset_token": reset_token,
            "reset_token_expiry": expiry,
        }}
    )

    try:
        await send_password_reset_email(body.email, reset_token)
    except Exception as e:
        print(f"[CRIM] Warning: could not send reset email: {e}")

    return {"message": "If that email is registered, a reset link has been sent."}


# ─────────────────────────────────────────────
# RESET PASSWORD
# ─────────────────────────────────────────────

@router.post("/reset-password")
async def reset_password(body: ResetPasswordRequest):
    user = await users_collection.find_one({"reset_token": body.token})

    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset link")

    expiry = user.get("reset_token_expiry")
    if expiry and datetime.utcnow() > expiry:
        raise HTTPException(status_code=400, detail="Reset link has expired. Please request a new one.")

    if len(body.new_password) < 6:
        raise HTTPException(status_code=422, detail="Password must be at least 6 characters")

    await users_collection.update_one(
        {"email": user["email"]},
        {"$set": {
            "password": hash_password(body.new_password),
            "reset_token": None,
            "reset_token_expiry": None,
        }}
    )

    return {"message": "Password reset successfully. You can now log in."}