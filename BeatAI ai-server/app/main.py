from fastapi import FastAPI
from app.schemas import AnalyzeRequest, AnalyzeResponse, MusicQueryRequest, MusicQueryResponse
from app.services.emotion_service import analyze_emotion
from app.services.music_query_service import create_music_query

app = FastAPI()

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    return {"scores": analyze_emotion(req.text)}

@app.post("/music-query", response_model=MusicQueryResponse)
def music_query(req: MusicQueryRequest):
    query = create_music_query(req.content)
    return {"query": query}