package com.example.BeatAI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DiaryHistoryDetailResponse {
  private Long diaryId;
  private String date;
  private String topEmotion;
  private String content;
}
