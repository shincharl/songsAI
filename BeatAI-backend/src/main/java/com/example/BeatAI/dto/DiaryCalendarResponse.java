package com.example.BeatAI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DiaryCalendarResponse {
  private Long diaryId;
  private String date;
  private String preview;
  private String topEmotion;
  private Double topEmotionScore;
}
