package com.example.BeatAI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DiaryHistoryResponse {
  private Long diaryId;
  private String date;
  private String preview;
  private String topEmotion;
}
