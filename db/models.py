from __future__ import annotations

from enum import Enum

from sqlalchemy import Column, Enum as SqlEnum, DateTime, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from db.base import Base


class CaseStatus(str, Enum):
    raw = "raw"
    summarized = "summarized"
    verified = "verified"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)

    user_sessions = relationship("UserSession", back_populates="user", cascade="all, delete-orphan")

class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(String(255), primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="user_sessions")


class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    neutral_citation = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(500), nullable=True)
    content = Column(Text, nullable=False)
    status = Column(SqlEnum(CaseStatus), nullable=False, default=CaseStatus.raw)
    summary_prompt = Column(Text, nullable=True)
    summary_generated = Column(Text, nullable=True)
    summary_verified = Column(Text, nullable=True)