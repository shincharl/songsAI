from fastapi import FastAPI
from app.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.emotion_service import analyze_emotion

app = FastAPI()

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    return {"scores": analyze_emotion(req.text)}