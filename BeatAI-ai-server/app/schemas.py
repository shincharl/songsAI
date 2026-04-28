from pydantic import BaseModel
from typing import Dict, List, Optional

class AnalyzeRequest(BaseModel):
    text: str

class AnalyzeResponse(BaseModel):
    scores: Dict[str, float]

class MusicMessageRequest(BaseModel):
    content: str

class MusicMessageResponse(BaseModel):
    message: str

class EmotionPoint(BaseModel):
    day: str
    score: float
    label: Optional[str] = None
    emoji: Optional[str] = None

class WeeklyInsightRequest(BaseModel):
    emotions: List[EmotionPoint]

class WeeklyInsightResponse(BaseModel):
    insight: str