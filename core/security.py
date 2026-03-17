import secrets
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext

SESSION_EXPIRE_DAYS = 1
SESSION_COOKIE_NAME = "session_id"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_session_token() -> str:
    return secrets.token_urlsafe(32)


def get_session_expiry() -> datetime:
    return datetime.now(timezone.utc) + timedelta(days=SESSION_EXPIRE_DAYS)