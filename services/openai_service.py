from __future__ import annotations

from fastapi import HTTPException
from openai import OpenAI

from core.config import settings


def get_openai_client() -> OpenAI:
    if not settings.OPENAI_API_KEY:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not set")
    return OpenAI(
        base_url='https://sentencing-predictor-openai.openai.azure.com/openai/v1',
        api_key=settings.OPENAI_API_KEY
    )


def summarize_case_with_llm(case_content: str, summary_prompt: str) -> str:
    client = get_openai_client()

    response = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {
                "role": "user",
                "content": f"{summary_prompt}\n\nThe full text of the case report is the following (presented in html format):\n{case_content}"
            },
        ]
    )

    # summary_text = getattr(response, "output_text", None)
    summary_text = response.choices[0].message.content
    if not summary_text:
        raise HTTPException(status_code=500, detail="LLM returned an empty response")

    return summary_text