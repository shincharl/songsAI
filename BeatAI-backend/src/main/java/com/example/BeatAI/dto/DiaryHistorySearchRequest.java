package com.example.BeatAI.dto;

import com.example.BeatAI.entity.EmotionType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DiaryHistorySearchRequest {
  private Integer year;
  private Integer month;
  private String keyword;
  private EmotionType emotion;
}
