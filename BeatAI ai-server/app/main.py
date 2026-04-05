from fastapi import FastAPI
from app.schemas import (
    AnalyzeRequest, 
    AnalyzeResponse, 
    MusicMessageRequest, 
    MusicMessageResponse,
    WeeklyInsightRequest,
    WeeklyInsightResponse,
    )
from app.services.emotion_service import analyze_emotion
from app.services.music_query_service import create_comfort_message
from app.services.weekly_insight_service import create_weekly_insight

app = FastAPI()

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    print("입력 텍스트 =", req.text)

    result = analyze_emotion(req.text)

    print("AI 감정 분석 결과 =", result)

    return {"scores": result}

@app.post("/music-message", response_model=MusicMessageResponse)
def music_query(req: MusicMessageRequest):
    message = create_comfort_message(req.content)
    return {"message": message}

@app.post("/weekly-insight", response_model=WeeklyInsightResponse)
def weekly_insight(req: WeeklyInsightRequest):
    insight = create_weekly_insight(req.emotions)
    return {"insight": insight}