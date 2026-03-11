package com.example.BeatAI.service;

import com.example.BeatAI.dto.MusicQueryRequest;
import com.example.BeatAI.dto.MusicQueryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class AiMusicQueryServiceImpl implements AiMusicQueryService{

  @Value("${ai.server.url}")
  private String aiServerUrl;

  @Override
  public String createYoutubeSearchQuery(String diaryContent) {
    RestTemplate restTemplate = new RestTemplate();

    String url = aiServerUrl + "/music-query";

    MusicQueryRequest request = new MusicQueryRequest(diaryContent);
    MusicQueryResponse response = restTemplate.postForObject(
      url,
      request,
      MusicQueryResponse.class
    );

    if (response == null || response.getQuery() == null || response.getQuery().isBlank()) {
      return "잔잔한 감성 노래 playlist";
    }

    return response.getQuery();
  }
}
