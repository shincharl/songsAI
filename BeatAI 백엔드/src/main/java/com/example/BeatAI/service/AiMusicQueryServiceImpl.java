package com.example.BeatAI.service;

import com.example.BeatAI.dto.DayEmotionTrendResponse;
import com.example.BeatAI.dto.MusicMessageRequest;
import com.example.BeatAI.dto.MusicMessageResponse;
import com.example.BeatAI.dto.WeeklyInsightRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiMusicQueryServiceImpl implements AiMusicQueryService {

  @Value("${ai.server.url}")
  private String aiServerUrl;

  private final RestTemplate restTemplate = new RestTemplate();

  @Override
  public String createMusicMessage(String diaryContent) {
    RestTemplate restTemplate = new RestTemplate();

    String url = aiServerUrl + "/music-message";

    MusicMessageRequest request = new MusicMessageRequest(diaryContent);
    MusicMessageResponse response = restTemplate.postForObject(
      url,
      request,
      MusicMessageResponse.class
    );

    if (response == null || response.getMessage() == null || response.getMessage().isBlank()) {
      return "오늘 마음에 어울리는 노래를 골라봤어";
    }

    return response.getMessage();
  }

  @Override
  public String generateWeeklyInsight(List<DayEmotionTrendResponse> trend) {
    String url = aiServerUrl + "/weekly-insight";

    WeeklyInsightRequest request = new WeeklyInsightRequest(trend);

    try {
      ResponseEntity<Map> response =
        restTemplate.postForEntity(url, request, Map.class);

      Object insight = response.getBody().get("insight");
      return insight != null ? insight.toString() : "최근 감정 흐름이 조금씩 안정되고 있어요.";
    } catch(Exception e){
      e.printStackTrace();
      return "최근 감정 흐름을 분석했어요.";
    }
  }
}
