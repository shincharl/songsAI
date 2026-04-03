package com.example.BeatAI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DayEmotionTrendResponse {
  private String day;
  private Double score;
  private String emoji;
  private String label;
  private String date;
}
