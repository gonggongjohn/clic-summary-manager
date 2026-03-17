from __future__ import annotations

from fastapi import APIRouter, Depends, Cookie, HTTPException, Response
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from core.security import hash_password, verify_password
from db.models import User, UserSession
from dependencies import get_db
from schemas.common import OkResponse
from schemas.user import LoginRequest, RegisterRequest
from core.security import (
    SESSION_COOKIE_NAME,
    create_session_token,
    get_session_expiry,
)
from dependencies import get_current_user

router = APIRouter(prefix="/user", tags=["user"])


@router.post("/register", response_model=OkResponse)
def user_register(payload: RegisterRequest, db: Session = Depends(get_db)) -> OkResponse:
    user = User(
        username=payload.username,
        email=payload.email,
        password=hash_password(payload.password),
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Username or email already exists")

    return OkResponse()


@router.post("/login")
def user_login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == payload.username).first()
    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    session = UserSession(
        id=create_session_token(),
        user_id=user.id,
        expires_at=get_session_expiry(),
    )
    db.add(session)
    db.commit()

    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=session.id,
        httponly=True,
        secure=True,      # set True in HTTPS production
        samesite="none",    # use "none" only if you truly need cross-site cookies over HTTPS
        max_age=1 * 24 * 60 * 60,
        path="/",
    )

    return {
        "ok": True,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
        }
    }

@router.post("/logout", response_model=OkResponse)
def user_logout(
    response: Response,
    current_user: User = Depends(get_current_user),
    session_id: str | None = Cookie(default=None, alias=SESSION_COOKIE_NAME),
    db: Session = Depends(get_db),
) -> OkResponse:
    if session_id:
        session = db.query(UserSession).filter(UserSession.id == session_id).first()
        if session:
            db.delete(session)
            db.commit()

    response.delete_cookie(
        key=SESSION_COOKIE_NAME,
        path="/",
    )
    return OkResponse()


@router.get("/me")
def user_me(current_user: User = Depends(get_current_user)):
    return {
        "authenticated": True,
        "user": {
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email,
        },
    }