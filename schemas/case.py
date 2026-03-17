from __future__ import annotations

from typing import Optional

from pydantic import BaseModel

from db.models import CaseStatus


class AddCaseRequest(BaseModel):
    neutral_citation: str
    content: str
    name: Optional[str] = None


class CaseListItem(BaseModel):
    name: Optional[str]
    neutral_citation: str
    status: CaseStatus


class CaseContentResponse(BaseModel):
    neutral_citation: str
    content: str