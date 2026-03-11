package com.example.BeatAI.service;

import com.example.BeatAI.dto.YoutubeVideoItemResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class YoutubeServiceImpl implements YoutubeService {

  @Value("${youtube.api-key}")
  private String apiKey;

  @Override
  public List<YoutubeVideoItemResponse> searchVideos(String query) {
    RestTemplate restTemplate = new RestTemplate();

    String url = UriComponentsBuilder
      .fromUriString("https://www.googleapis.com/youtube/v3/search")
      .queryParam("part", "snippet")
      .queryParam("q", query)
      .queryParam("type", "video")
      .queryParam("maxResults", 10)
      .queryParam("videoCategoryId", "10")
      .queryParam("videoEmbeddable", "true")
      .queryParam("regionCode", "KR")
      .queryParam("relevanceLanguage", "ko")
      .queryParam("key", apiKey)
      .toUriString();

    System.out.println("youtube url = " + url);

    @SuppressWarnings("unchecked")
    Map<String, Object> response = restTemplate.getForObject(url, Map.class);

    System.out.println("response = " + response);

    if (response == null || response.get("items") == null) {
      return List.of();
    }

    @SuppressWarnings("unchecked")
    List<Map<String, Object>> items = (List<Map<String, Object>>) response.get("items");

    List<YoutubeVideoItemResponse> videos = new ArrayList<>();

    for (Map<String, Object> item : items) {
      @SuppressWarnings("unchecked")
      Map<String, Object> id = (Map<String, Object>) item.get("id");
      @SuppressWarnings("unchecked")
      Map<String, Object> snippet = (Map<String, Object>) item.get("snippet");

      if (id == null || snippet == null) {
        continue;
      }

      String videoId = (String) id.get("videoId");
      String title = (String) snippet.get("title");
      String channelTitle = (String) snippet.get("channelTitle");

      if (videoId == null || videoId.isBlank()) {
        System.out.println("videoId 없음, 스킵");
        continue;
      }

      if (title == null) title = "";
      if (channelTitle == null) channelTitle = "";

      String thumbnailUrl = "";
      @SuppressWarnings("unchecked")
      Map<String, Object> thumbnails = (Map<String, Object>) snippet.get("thumbnails");

      if (thumbnails != null) {
        @SuppressWarnings("unchecked")
        Map<String, Object> high = (Map<String, Object>) thumbnails.get("high");

        if (high != null && high.get("url") != null) {
          thumbnailUrl = (String) high.get("url");
        }
      }

      System.out.println("추가되는 영상: " + videoId + " / " + title);

      videos.add(new YoutubeVideoItemResponse(
        videoId,
        title,
        channelTitle,
        thumbnailUrl
      ));
    }

    System.out.println("최종 videos 개수 = " + videos.size());

    return videos;
  }
}
