package com.example.BeatAI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class WeeklyInsightRequest {

  private List<DayEmotionTrendResponse> emotions;
}
