from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
import random
import os

model = ChatOpenAI(
    model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
    temperature=0.7,
)

prompt = ChatPromptTemplate.from_template("""
너의 역할은 사용자의 일기를 읽고 음악 추천 화면에 들어갈 짧은 한 줄 문장을 만드는 것이다.

규칙:
- 반드시 한 문장만 출력
- 줄바꿈 금지
- 따옴표 금지
- 한국어로 출력
- 20자~35자 정도
- 사용자의 문장을 그대로 반복하거나 요약하지 말 것
- 일기에 나온 표현을 길게 따라 쓰지 말 것
- 공감은 담되, 담백하고 자연스럽게 작성
- 조언, 훈계, 해결책 제시 금지
- 음악 추천 서비스에 어울리는 짧은 안내 문구처럼 작성

예시:
- 오늘은 마음을 천천히 쉬게 해줄 노래가 어울려
- 조금 복잡한 기분을 다독여줄 음악을 골라봤어
- 오늘 분위기에 조용히 스며드는 곡을 준비했어

일기:
{diary}
""")

chain = prompt | model

DEFAULT_MESSAGE = "오늘 마음에 어울리는 노래를 골라봤어"

FALLBACK_MESSAGES = [
    "오늘은 마음을 천천히 쉬게 해줄 노래가 어울려",
    "조금 복잡한 기분을 다독여줄 음악을 골라봤어",
    "오늘 분위기에 조용히 스며드는 곡을 준비했어",
    "지금 마음에 무리 없이 닿는 노래를 골라봤어",
]

def is_too_similar(input_text: str, output_text: str) -> bool:
    input_text = (input_text or "").strip()
    output_text = (output_text or "").strip()

    if not input_text or not output_text:
        return True

    if output_text in input_text:
        return True

    input_words = set(input_text.split())
    output_words = set(output_text.split())

    if not output_words:
        return True

    overlap = len(input_words & output_words) / len(output_words)
    return overlap >= 0.5

def create_comfort_message(content: str) -> str:
    text = (content or "").strip()

    if not text:
        return DEFAULT_MESSAGE

    try:
        result = chain.invoke({"diary": text})
        message = (result.content or "").strip()
        message = message.replace('"', "").replace("'", "")
        message = message.split("\n")[0].strip()

        if not message or is_too_similar(text, message):
            return random.choice(FALLBACK_MESSAGES)

        print("최종 message =", message)
        return message
    
    except Exception as e:
        print("comfort message 생성 실패:", e)
        return random.choice(FALLBACK_MESSAGES)