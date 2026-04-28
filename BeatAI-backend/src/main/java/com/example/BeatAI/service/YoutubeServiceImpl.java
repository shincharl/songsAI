package com.example.BeatAI.service;

import com.example.BeatAI.dto.YoutubeVideoItemResponse;
import com.example.BeatAI.dto.youtubesearch.YoutubeSearchResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class YoutubeServiceImpl implements YoutubeService {

  @Value("${youtube.api-key}")
  private String apiKey;

  public List<YoutubeVideoItemResponse> searchVideosFromMessage(String message) {
    String baseQuery = normalizeQuery(convertMessageToQuery(message));

    System.out.println("message = " + message);
    System.out.println("baseQuery = " + baseQuery);

    List<String> queries = buildDiverseQueries(baseQuery, message);
    List<YoutubeVideoItemResponse> allVideos = new ArrayList<>();
    
    for (String query : queries) {
      System.out.println("검색 query = " + query);
      allVideos.addAll(searchVideos(query));
    }

    return deduplicateShuffleAndLimit(allVideos, 10);
  }

  @Override
  public String createSearchQueryFromMessage(String message) {
    return normalizeQuery(convertMessageToQuery(message));
  }

  @Override
  public List<YoutubeVideoItemResponse> searchVideos(String query) {
    RestTemplate restTemplate = new RestTemplate();

    query = normalizeQuery(query);

    System.out.println("query = " + query);

    URI uri = UriComponentsBuilder
      .fromUriString("https://www.googleapis.com/youtube/v3/search")
      .queryParam("part", "snippet")
      .queryParam("q", query)
      .queryParam("type", "video")
      .queryParam("maxResults", 10)
      .queryParam("order", pickOne("relevance", "date", "viewCount"))
//      .queryParam("videoCategoryId", "10")
//      .queryParam("regionCode", "KR")
//      .queryParam("relevanceLanguage", "ko")
      .queryParam("key", apiKey)
      .build()
      .encode()
      .toUri();

    System.out.println("youtube url = " + uri);

    YoutubeSearchResponse response;

    try {
      response = restTemplate.getForObject(uri, YoutubeSearchResponse.class);
    } catch (HttpClientErrorException e) {
      System.out.println("YouTube API 오류: " + e.getStatusCode());
      System.out.println("응답 본문: " + e.getResponseBodyAsString());

      String errorBody = e.getResponseBodyAsString();

      if (errorBody != null && errorBody.contains("quotaExceeded")) {
        throw new RuntimeException("유튜브 API 일일 할당량을 초과했습니다.");
      }

      throw new RuntimeException("유튜브 API 호출 중 오류가 발생했습니다.", e);
    }

    if (response == null || response.getItems() == null) {
      return List.of();
    }

    List<YoutubeVideoItemResponse> videos = new ArrayList<>();

    for (var item : response.getItems()) {
        if(item == null || item.getId() == null || item.getSnippet() == null) {
          continue;
        }

        String videoId = item.getId().getVideoId();
        String title = item.getSnippet().getTitle();
        String channelTitle = item.getSnippet().getChannelTitle();

      if (videoId == null || videoId.isBlank()) {
        System.out.println("videoId 없음, 스킵");
        continue;
      }

      if (title == null) title = "";
      if (channelTitle == null) channelTitle = "";

      if (isFilteredVideo(title, channelTitle)) {
        System.out.println("필터링된 영상: " + title);
        continue;
      }

      String thumbnailUrl = "";
      if (item.getSnippet().getThumbnails() != null
          && item.getSnippet().getThumbnails().getMedium() != null
          && item.getSnippet().getThumbnails().getMedium().getUrl() != null){
        thumbnailUrl = item.getSnippet().getThumbnails().getMedium().getUrl();
      }

      videos.add(new YoutubeVideoItemResponse(videoId, title, channelTitle, thumbnailUrl));
    }

    System.out.println("최종 videos 개수 = " + videos.size());

    return videos;
  }

  private String convertMessageToQuery(String message) {
    if (message == null || message.isBlank()) {
      return "감성적인 kpop 발라드";
    }

    String text = message.toLowerCase();

    String mood;
    String genre;
    String context = "";

    if (text.contains("지친") || text.contains("힘든") || text.contains("위로") || text.contains("쉬게") || text.contains("피곤")) {
      mood = pickOne("위로되는", "감성적인", "잔잔한", "따뜻한");
      genre = pickOne("kpop 발라드", "한국 인디", "드라마 ost");
    } else if (text.contains("설레") || text.contains("두근") || text.contains("반짝") || text.contains("사랑")) {
      mood = pickOne("설레는", "로맨틱한", "몽글한");
      genre = pickOne("드라마 ost", "kpop", "감성 발라드");
    } else if (text.contains("조용") || text.contains("차분") || text.contains("천천히") || text.contains("평온")) {
      mood = pickOne("잔잔한", "차분한", "고요한");
      genre = pickOne("한국 인디", "어쿠스틱", "잔잔한 발라드");
    } else if (text.contains("시원") || text.contains("답답") || text.contains("터뜨") || text.contains("스트레스")) {
      mood = pickOne("시원한", "강렬한", "속이 뚫리는");
      genre = pickOne("kpop rock", "밴드 음악", "록 발라드");
    } else if (text.contains("신나") || text.contains("밝은") || text.contains("기분 좋") || text.contains("행복") || text.contains("재미")) {
      mood = pickOne("신나는", "경쾌한", "밝은");
      genre = pickOne("kpop", "댄스 kpop", "밝은 인디");
    } else {
      mood = pickOne("감성적인", "잔잔한", "듣기 좋은");
      genre = pickOne("kpop 발라드", "한국 인디", "드라마 ost");
    }

    if (text.contains("밤") || text.contains("새벽")) {
      context = "새벽";
    } else if (text.contains("비")) {
      context = "비 오는 날";
    } else if (text.contains("퇴근") || text.contains("집 가는")) {
      context = "퇴근길";
    } else if (text.contains("공부") || text.contains("집중") || text.contains("작업") || text.contains("코딩")) {
      context = "집중할 때";
    }

    return (context + " " + mood + " " + genre).trim().replaceAll("\\s+", " ");
  }

  private String pickOne(String... values) {
    return values[ThreadLocalRandom.current().nextInt(values.length)];
  }

  private String normalizeQuery(String query) {
    if (query == null || query.isBlank()) {
      return "감성적인 kpop 발라드";
    }

    query = query.trim()
      .replace("\"", "")
      .replace("'", "");

    String[] bannedWords = {
      "찬양", "ccm", "CCM", "예배", "worship", "gospel", "복음성가", "주님", "하나님"
    };

    for (String word : bannedWords) {
      query = query.replace(word, "").trim();
    }

    String lower = query.toLowerCase();

    boolean hasGenreKeyword =
      lower.contains("kpop") ||
        query.contains("발라드") ||
        query.contains("인디") ||
        lower.contains("ost") ||
        lower.contains("rock") ||
        lower.contains("acoustic") ||
        query.contains("어쿠스틱") ||
        query.contains("피아노");

    if (!hasGenreKeyword) {
      query += " kpop";
    }

    return query.replaceAll("\\s+", " ").trim();
  }

  private boolean isFilteredVideo(String title, String channelTitle) {
    String t = title == null ? "" : title.toLowerCase();
    String c = channelTitle == null ? "" : channelTitle.toLowerCase();

    String[] banned = {
      "ccm", "worship", "gospel", "찬양", "예배", "복음성가",
      "cover", "reaction", "리액션",
      "live", "라이브", "직캠",
      "1 hour", "1시간", "sped up", "slowed", "lyrics", "shorts"
    };

    for (String word : banned) {
      if (t.contains(word) || c.contains(word)) {
        return true;
      }
    }

    return false;
  }

  private List<String> buildDiverseQueries(String baseQuery, String message) {
    Set<String> queries = new LinkedHashSet<>();

    queries.add(baseQuery);
    queries.add(baseQuery + " playlist");
    queries.add(baseQuery + " 노래 모음");
    queries.add(baseQuery + " 추천");
    queries.add(baseQuery + " mix");

    String text = message == null ? "" : message.toLowerCase();
    
    if (text.contains("밤") || text.contains("새벽")) {
      queries.add("새벽에 듣기 좋은 " +  baseQuery);
    }
    
    if (text.contains("비")) {
      queries.add("비 오는 날 듣기 좋은" + baseQuery);
    }

    if (text.contains("공부") || text.contains("집중") || text.contains("작업") || text.contains("코딩")) {
      queries.add("집중할 때 듣는 " + baseQuery);
    }

    if (text.contains("위로") || text.contains("힘든") || text.contains("지친")) {
      queries.add("위로되는 " + baseQuery);
    }

    if (text.contains("신나") || text.contains("행복") || text.contains("기분 좋")) {
      queries.add("기분 좋아지는 " + baseQuery);
    }

    return new ArrayList<>(queries);
  }

  private List<YoutubeVideoItemResponse> deduplicateShuffleAndLimit(
    List<YoutubeVideoItemResponse> videos,
    int limit
  ){
    Map<String, YoutubeVideoItemResponse> uniqueMap = new LinkedHashMap<>();

    for(YoutubeVideoItemResponse video : videos){
      if (video == null || video.getVideoId() == null || video.getVideoId().isBlank()){
        continue;
      }

      uniqueMap.putIfAbsent(video.getVideoId(), video);
    }

    List<YoutubeVideoItemResponse> uniqueList = new ArrayList<>(uniqueMap.values());
    Collections.shuffle(uniqueList);

    Map<String, Integer> channelCount = new LinkedHashMap<>();
    List<YoutubeVideoItemResponse> result = new ArrayList<>();

    for (YoutubeVideoItemResponse video : uniqueList) {
      String channel = video.getChannelTitle() == null ? "" : video.getChannelTitle();
      int count = channelCount.getOrDefault(channel,0);

      if (count > 2){
        continue;
      }

      result.add(video);
      channelCount.put(channel, count + 1);

      if (result.size() >= limit){
        break;
      }
    }

    return result;
  }
}
