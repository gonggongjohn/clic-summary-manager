from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from db.models import Case, CaseStatus
from dependencies import get_db, get_current_user
from schemas.case import AddCaseRequest, CaseContentResponse, CaseListItem
from schemas.common import OkResponse
from schemas.summary import SummaryRequest, SummaryResponse
from services.openai_service import summarize_case_with_llm

router = APIRouter(
    prefix="/case",
    tags=["case"],
    dependencies=[Depends(get_current_user)]
)

@router.get("/list", response_model=list[CaseListItem])
def case_list(
    N: int = Query(..., gt=0, le=1000),
    db: Session = Depends(get_db),
) -> list[CaseListItem]:
    cases = db.query(Case).order_by(Case.id.asc()).limit(N).all()
    return [
        CaseListItem(
            name=case.name,
            neutral_citation=case.neutral_citation,
            status=case.status,
        )
        for case in cases
    ]


@router.post("/add", response_model=OkResponse)
def case_add(payload: AddCaseRequest, db: Session = Depends(get_db)) -> OkResponse:
    existing = db.query(Case).filter(Case.neutral_citation == payload.neutral_citation).first()
    if existing:
        raise HTTPException(status_code=400, detail="Case already exists")

    case = Case(
        neutral_citation=payload.neutral_citation,
        name=payload.name,
        content=payload.content,
        status=CaseStatus.raw,
    )
    db.add(case)
    db.commit()
    return OkResponse()


@router.get("/getContent", response_model=CaseContentResponse)
def case_get_content(
    neutral_citation: str = Query(...),
    db: Session = Depends(get_db),
) -> CaseContentResponse:
    case = db.query(Case).filter(Case.neutral_citation == neutral_citation).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    return CaseContentResponse(
        neutral_citation=case.neutral_citation,
        content=case.content,
    )


@router.post("/summary", response_model=SummaryResponse)
def case_summary(payload: SummaryRequest, db: Session = Depends(get_db)) -> SummaryResponse:
    case = db.query(Case).filter(Case.neutral_citation == payload.neutral_citation).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    summary = summarize_case_with_llm(case.content, payload.summary_prompt)

    # case.summary_prompt = payload.summary_prompt
    # case.summary_generated = summary
    # case.status = CaseStatus.summarized
    # db.commit()

    return SummaryResponse(
        neutral_citation=case.neutral_citation,
        prompt=payload.summary_prompt,
        summary=summary,
    )