def create_music_query(content: str) -> str:
    text = (content or "").strip()

    if not text:
        return "kpop ballad"

    if any(word in text for word in ["지쳤", "힘들", "피곤", "우울", "외롭"]):
        return "kpop sad song"

    if any(word in text for word in ["행복", "신나", "좋았", "즐거", "설렜"]):
        return "kpop upbeat song"

    if any(word in text for word in ["화나", "짜증", "답답"]):
        return "kpop rock"

    if any(word in text for word in ["새벽", "조용", "혼자", "차분"]):
        return "kpop chill ballad"

    return "kpop emotional ballad"