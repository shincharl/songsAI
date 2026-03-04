from pydantic import BaseModel
from typing import Dict

class AnalyzeRequest(BaseModel):
    text: str

class AnalyzeResponse(BaseModel):
    scores: Dict[str, float]