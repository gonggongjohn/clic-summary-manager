from __future__ import annotations

from fastapi import Cookie, Depends, HTTPException
from db.models import UserSession, User
from db.session import SessionLocal
from sqlalchemy.orm import Session
from typing import Generator
from core.security import SESSION_COOKIE_NAME
from datetime import datetime, timezone


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    session_id: str | None = Cookie(default=None, alias=SESSION_COOKIE_NAME),
    db: Session = Depends(get_db),
) -> User:
    if not session_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    session = db.query(UserSession).filter(UserSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")

    if session.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        db.delete(session)
        db.commit()
        raise HTTPException(status_code=401, detail="Session expired")

    user = db.query(User).filter(User.id == session.user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user