from fastapi import FastAPI
from app.schemas import AnalyzeRequest, AnalyzeResponse, MusicMessageRequest, MusicMessageResponse
from app.services.emotion_service import analyze_emotion
from app.services.music_query_service import create_comfort_message

app = FastAPI()

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    return {"scores": analyze_emotion(req.text)}

@app.post("/music-message", response_model=MusicMessageResponse)
def music_query(req: MusicMessageRequest):
    message = create_comfort_message(req.content)
    return {"message": message}