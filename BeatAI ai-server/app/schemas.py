from pydantic import BaseModel
from typing import Dict

class AnalyzeRequest(BaseModel):
    text: str

class AnalyzeResponse(BaseModel):
    scores: Dict[str, float]

class MusicMessageRequest(BaseModel):
    content: str

class MusicMessageResponse(BaseModel):
    message: str