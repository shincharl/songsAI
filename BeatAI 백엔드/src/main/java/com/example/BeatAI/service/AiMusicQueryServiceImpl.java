package com.example.BeatAI.service;

import com.example.BeatAI.dto.MusicMessageRequest;
import com.example.BeatAI.dto.MusicMessageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class AiMusicQueryServiceImpl implements AiMusicQueryService {

  @Value("${ai.server.url}")
  private String aiServerUrl;

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
}
