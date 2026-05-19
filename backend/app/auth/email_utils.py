import requests
import os
from dotenv import load_dotenv

load_dotenv()

BREVO_API_KEY = os.getenv("BREVO_API_KEY")
BREVO_SENDER_EMAIL = "crm.app.dev@gmail.com"
BREVO_SENDER_NAME = "CRIM"

def send_email(to_email: str, subject: str, body: str):
    api_key = os.getenv("BREVO_API_KEY")
    print(f"[BREVO] API key present: {bool(api_key)}, sending to: {to_email}")
    response = requests.post(
        "https://api.brevo.com/v3/smtp/email",
        headers={
            "api-key": api_key,
            "Content-Type": "application/json"
        },
        json={
            "sender": {"name": BREVO_SENDER_NAME, "email": BREVO_SENDER_EMAIL},
            "to": [{"email": to_email}],
            "subject": subject,
            "textContent": body
        }
    )
    print(f"[BREVO] status: {response.status_code}, response: {response.text}")
    if response.status_code != 201:
        raise Exception(f"Brevo error: {response.text}")

async def send_verification_email(to_email: str, token: str):
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    link = f"{frontend_url}/verify-email?token={token}"
    send_email(to_email, "Verify your CRIM account", f"Click to verify: {link}")

async def send_password_reset_email(to_email: str, token: str):
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    link = f"{frontend_url}/reset-password?token={token}"
    send_email(to_email, "CRIM Password Reset", f"Click to reset your password: {link}")