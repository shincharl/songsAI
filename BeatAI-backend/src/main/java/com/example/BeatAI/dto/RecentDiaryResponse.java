package com.example.BeatAI.dto;

import com.example.BeatAI.entity.Diary;
import com.example.BeatAI.entity.EmotionLog;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RecentDiaryResponse {
  private Long diaryId;
  private String content;
  private String topEmotion;
  private Double topEmotionScore;
  private String createdAt;

  public static RecentDiaryResponse from(Diary diary, EmotionLog emotionLog){
    return RecentDiaryResponse.builder()
      .diaryId(diary.getId())
      .content(diary.getContent())
      .topEmotion(emotionLog != null ? emotionLog.getEmotion().name() : null)
      .topEmotionScore(emotionLog != null ? emotionLog.getScore() : 0.0)
      .createdAt(diary.getCreatedAt().toString())
      .build();
  }
}
