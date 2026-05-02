from passlib.hash import bcrypt
from datetime import datetime, timedelta
from jose import jwt
import os

SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")
ALGORITHM = "HS256"


def hash_password(password: str):
    return bcrypt.hash(password[:72])   # direct bcrypt


def verify_password(plain, hashed):
    return bcrypt.verify(plain[:72], hashed)


def create_access_token(data: dict):
    to_encode = data.copy()
    to_encode.update({
        "exp": datetime.utcnow() + timedelta(hours=2)
    })
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)