from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from db.models import Case, CaseStatus
from dependencies import get_db, get_current_user
from schemas.common import OkResponse
from schemas.summary import SetVerifiedSummaryRequest, SetGeneratedSummaryRequest, SummaryResponse

router = APIRouter(
    prefix="/summary",
    tags=["summary"],
    dependencies=[Depends(get_current_user)]
)


@router.get("/getGenerated", response_model=SummaryResponse)
def summary_get_generated(
    neutral_citation: str = Query(...),
    db: Session = Depends(get_db),
) -> SummaryResponse:
    case = db.query(Case).filter(Case.neutral_citation == neutral_citation).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    if case.summary_prompt is None or case.summary_generated is None:
        return SummaryResponse(
            neutral_citation=case.neutral_citation,
            prompt="",
            summary="",
        )
    else:
        return SummaryResponse(
            neutral_citation=case.neutral_citation,
            prompt=case.summary_prompt,
            summary=case.summary_generated,
        )

@router.post("/setGenerated", response_model=OkResponse)
def summary_set_generated(
    payload: SetGeneratedSummaryRequest,
    db: Session = Depends(get_db),
) -> SummaryResponse:
    case = db.query(Case).filter(Case.neutral_citation == payload.neutral_citation).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    case.summary_prompt = payload.summary_prompt
    case.summary_generated = payload.summary_generated
    case.status = CaseStatus.summarized
    db.commit()
    return OkResponse()


@router.get("/getVerified", response_model=SummaryResponse)
def summary_get_verified(
    neutral_citation: str = Query(...),
    db: Session = Depends(get_db),
) -> SummaryResponse:
    case = db.query(Case).filter(Case.neutral_citation == neutral_citation).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    if case.summary_prompt is None or case.summary_verified is None:
        return SummaryResponse(
            neutral_citation=case.neutral_citation,
            prompt="",
            summary="",
        )
    else:
        return SummaryResponse(
            neutral_citation=case.neutral_citation,
            prompt="",
            summary=case.summary_verified,
        )


@router.post("/setVerified", response_model=OkResponse)
def summary_set_verified(
    payload: SetVerifiedSummaryRequest,
    db: Session = Depends(get_db),
) -> OkResponse:
    case = db.query(Case).filter(Case.neutral_citation == payload.neutral_citation).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    case.summary_verified = payload.summary_verified
    case.status = CaseStatus.verified
    db.commit()
    return OkResponse()