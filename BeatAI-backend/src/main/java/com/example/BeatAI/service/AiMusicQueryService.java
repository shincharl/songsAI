package com.example.BeatAI.service;

import com.example.BeatAI.dto.DayEmotionTrendResponse;

import java.util.List;

public interface AiMusicQueryService {
  String createMusicMessage(String diaryContent);
  String generateWeeklyInsight(List<DayEmotionTrendResponse> trend);
}
