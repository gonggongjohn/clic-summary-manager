from __future__ import annotations

from typing import Optional

from pydantic import BaseModel


class SummaryRequest(BaseModel):
    neutral_citation: str
    model: str
    summary_prompt: str


class SetVerifiedSummaryRequest(BaseModel):
    neutral_citation: str
    summary_verified: str

class SetGeneratedSummaryRequest(BaseModel):
    neutral_citation: str
    summary_prompt: str
    summary_generated: str


class SummaryResponse(BaseModel):
    neutral_citation: str
    prompt: Optional[str]
    summary: Optional[str]