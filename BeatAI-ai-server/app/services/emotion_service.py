from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from typing import Dict
import os
import json
import re

model = ChatOpenAI(
    model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
    temperature=0.1,
)

prompt = ChatPromptTemplate.from_template("""
너는 사용자의 일기를 읽고 감정을 분석하는 역할이다.

반드시 아래 JSON 형식만 출력해라.
설명, 문장, 코드블록, 따옴표 밖의 텍스트는 절대 쓰지 마라.

감정 점수는 총합이 100이 되게 해라.
사용 가능한 감정 키:
HAPPY, SAD, ANGRY, CALM, EXCITED, NEUTRAL

일기:
{diary}

출력 예시:
{{
  "HAPPY": 10.0,
  "SAD": 40.0,
  "ANGRY": 0.0,
  "CALM": 20.0,
  "EXCITED": 0.0,
  "NEUTRAL": 30.0
}}
""")

chain = prompt | model

ALL_KEYS = ["HAPPY", "SAD", "ANGRY", "CALM", "EXCITED", "NEUTRAL"]

DEFAULT_SCORES = {
    "HAPPY": 0.0,
    "SAD": 0.0,
    "ANGRY": 0.0,
    "CALM": 0.0,
    "EXCITED": 0.0,
    "NEUTRAL": 100.0,
}

def extract_json(text: str) -> dict:
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return {}
    return json.loads(match.group())

def normalize_scores(scores: dict) -> Dict[str, float]:
    result = {}

    for key in ALL_KEYS:
        try:
            value = float(scores.get(key, 0.0))
        except Exception:
            value = 0.0

        result[key] = max(0.0, value)

    total = sum(result.values())

    if total <= 0:
        return DEFAULT_SCORES

    return {
        key: round((value / total) * 100, 1)
        for key, value in result.items()
    }

def analyze_emotion(text: str) -> Dict[str, float]:
    diary = (text or "").strip()

    if not diary:
        return DEFAULT_SCORES

    try:
        result = chain.invoke({"diary": diary})
        content = (result.content or "").strip()

        parsed = extract_json(content)
        return normalize_scores(parsed)

    except Exception as e:
        print("[AI ERROR] emotion 분석 실패:", e)
        return DEFAULT_SCORES