import smtplib
import os
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

GMAIL_USER = os.getenv("MAIL_USERNAME")
GMAIL_PASS = os.getenv("MAIL_PASSWORD")

def send_email(to_email: str, subject: str, body: str):
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = GMAIL_USER
    msg["To"] = to_email

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(GMAIL_USER, GMAIL_PASS)
        server.sendmail(GMAIL_USER, to_email, msg.as_string())
    print(f"[GMAIL] Sent to {to_email}")

async def send_verification_email(to_email: str, token: str):
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    link = f"{frontend_url}/verify-email?token={token}"
    send_email(to_email, "Verify your CRIM account", f"Click to verify: {link}")

async def send_password_reset_email(to_email: str, token: str):
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    link = f"{frontend_url}/reset-password?token={token}"
    send_email(to_email, "CRIM Password Reset", f"Click to reset your password: {link}")