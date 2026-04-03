from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
import random
import re

model = ChatOllama(
    model="llama3.2:3b",
    temperature=0.3,
)

prompt = ChatPromptTemplate.from_template("""
너의 역할은 최근 7일 감정 흐름을 사용자 화면에 보여줄
짧고 자연스러운 한국어 한 문장 인사이트로 바꾸는 것이다.

규칙:
- 반드시 한국어 한 문장만 출력
- 줄바꿈 금지
- 따옴표 금지
- 18자~32자 이내
- 영어 단어 사용 금지
- 숫자, 점수, 퍼센트 직접 언급 금지
- happiness, sadness 같은 감정 라벨명 직접 언급 금지
- 어색한 번역투 금지
- 과한 위로, 훈계, 해결책 제시 금지
- 서비스 화면에 들어갈 짧은 인사이트 문구처럼 작성
- 자연스럽게 끝나는 문장으로 작성

감정 흐름:
{trend}

좋은 예시:
- 최근 감정이 한결 안정된 흐름이에요
- 초반보다 마음이 조금 가벼워졌어요
- 이번 주는 감정 기복이 조금 있었어요
- 최근 마음이 차분해지는 모습이에요

나쁜 예시:
- happiness score가 4.3입니다
- 지난 7일 동안 감정이 합리적으로 지속됩니다
- 최근 점수가 상승하는 경향입니다

출력:
""")

chain = prompt | model

DEFAULT_INSIGHT = "최근 감정 흐름을 차분히 살펴봤어요"

def analyze_trend(emotions) -> str:
    scores = [e.score for e in emotions if hasattr(e, "score")]

    if not scores:
        return "데이터 부족"

    start = scores[0]
    end = scores[-1]
    diff = end - start
    gap = max(scores) - min(scores)

    if gap >= 2.0:
        return "기복"
    if diff >= 0.8:
        return "회복"
    if diff <= -0.8:
        return "하락"
    return "안정"

def trend_to_message(trend: str) -> str:
    if trend == "회복":
        return random.choice([
            "초반보다 마음이 조금 가벼워졌어요",
            "최근 감정이 점차 나아지는 흐름이에요",
        ])
    if trend == "하락":
        return random.choice([
            "최근 감정이 조금 가라앉는 흐름이에요",
            "마음이 다소 지친 흐름이 보였어요",
        ])
    if trend == "기복":
        return random.choice([
            "이번 주는 감정 기복이 조금 있었어요",
            "최근 마음의 흐름이 조금 흔들렸어요",
        ])
    return random.choice([
        "최근 감정이 한결 안정된 흐름이에요",
        "마음이 비교적 차분하게 이어지고 있어요",
    ])

def is_invalid_insight(text: str) -> bool:
    text = (text or "").strip()

    if not text:
        return True

    if len(text) < 8 or len(text) > 40:
        return True

    lowered = text.lower()

    banned_words = [
        "score", "happiness", "sadness", "angry", "calm",
        "점수", "퍼센트", "%"
    ]
    if any(word in lowered for word in banned_words):
        return True

    # 영어가 너무 섞이면 실패 처리
    english_count = len(re.findall(r"[a-zA-Z]", text))
    if english_count >= 3:
        return True

    # 한글이 너무 적으면 실패 처리
    korean_count = len(re.findall(r"[가-힣]", text))
    if korean_count < 6:
        return True

    # 문장 끝이 이상한 영문/숫자 꼬리면 실패 처리
    if re.search(r"[A-Za-z0-9]{4,}$", text):
        return True

    return False

def create_weekly_insight(emotions) -> str:
    if not emotions:
        return DEFAULT_INSIGHT

    trend = analyze_trend(emotions)
    fallback = trend_to_message(trend)

    try:
        result = chain.invoke({
            "trend": trend,
        })
        insight = (result.content or "").strip()
        insight = insight.replace('"', "").replace("'", "")
        insight = insight.split("\n")[0].strip()

        if is_invalid_insight(insight):
            return fallback

        return insight

    except Exception as e:
        print("weekly insight 생성 실패:", e)
        return fallback