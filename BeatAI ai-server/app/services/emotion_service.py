from transformers import pipeline, AutoTokenizer
from typing import Dict
from functools import lru_cache

MODEL_ID = "jeongyoonhuh/kobert-emotion-6class"
TOKENIZER_ID = "monologg/kobert"

@lru_cache
def get_classifier():
    tok = AutoTokenizer.from_pretrained(
        TOKENIZER_ID,
        use_fast=False,
        trust_remote_code=True,
    )
    return pipeline(
        "text-classification",
        model=MODEL_ID,   
        tokenizer=tok,         
        top_k=None,
    )

def analyze_emotion(text: str) -> Dict[str, float]:
    text = text or ""
    out = get_classifier()(text)

    LABEL_MAP = {
        "기쁨": "HAPPY",
        "슬픔": "SAD",
        "분노": "ANGRY",
        "불안": "CALM",
        "당황": "EXCITED",
        "상처": "SAD",
    }
    ALL_KEYS = ["HAPPY", "SAD", "ANGRY", "CALM", "EXCITED", "NEUTRAL"]

    results = out[0] if isinstance(out, list) else out
    label_scores = results if (results and isinstance(results[0], dict)) else results[0]

    scores = {k: 0.0 for k in ALL_KEYS}
    for r in label_scores:
        mapped = LABEL_MAP.get(r["label"])
        if mapped:
            scores[mapped] += float(r["score"])

    total = sum(scores.values())
    if total <= 0:
        scores = {k: 0.0 for k in ALL_KEYS}
        scores["NEUTRAL"] = 100.0
        return scores

    for k in scores:
        scores[k] /= total

    scores = {k: round(v * 100, 1) for k, v in scores.items()}    
    return scores