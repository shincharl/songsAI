package com.example.BeatAI.service;

import com.example.BeatAI.dto.*;
import com.example.BeatAI.entity.EmotionType;
import com.example.BeatAI.repository.RecommendedVideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class PlaylistService {

  private final RecommendedVideoRepository recommendedVideoRepository;

  public FeaturedPlaylistResponse getFeaturedPlaylist() {

    LocalDate today = LocalDate.now();
    LocalDate monday = today.with(DayOfWeek.MONDAY);
    LocalDate nextMonday = monday.plusWeeks(1);

    LocalDateTime start = monday.atStartOfDay();
    LocalDateTime end = nextMonday.atStartOfDay();

    PageRequest pageable = PageRequest.of(0, 1);

    List<FeaturedPlaylistQueryDto> results =
      recommendedVideoRepository.findFeaturedPlaylistBetween(start, end, pageable);

    if (results.isEmpty()) {
      return new FeaturedPlaylistResponse(
        "\uD83D\uDD25 인기 TOP 1",
        "아직 인기 플레이리스트가 없어요",
        "추천 데이터가 쌓이면 보여드릴게요.",
        "",
        "",
        "",
        0L
      );
    }

    // 결과 반환
    FeaturedPlaylistQueryDto top = results.get(0);

    return new FeaturedPlaylistResponse(
      "\uD83D\uDD25 인기 TOP 1",
      top.getTitle(),
      "이번 주 사용자들에게 가장 자주 추천된 플레이리스트에요.",
      top.getThumbnailUrl(),
      top.getChannelTitle(),
      top.getVideoId(),
      top.getRecommendCount()
    );
  }

  public List<TrendingPlaylistResponse> getTrendingPlaylists() {

    LocalDate today = LocalDate.now();
    LocalDate monday = today.with(DayOfWeek.MONDAY);
    LocalDate nextMonday = monday.plusWeeks(1);

    LocalDateTime start = monday.atStartOfDay();
    LocalDateTime end = nextMonday.atStartOfDay();

    List<TrendingPlaylistQueryDto> results =
      recommendedVideoRepository.findTrendingPlaylistsBetween(
        start,
        end,
        PageRequest.of(0, 8)
      );

    return IntStream.range(0, results.size())
      .mapToObj(index -> {
        TrendingPlaylistQueryDto item = results.get(index);

        return new TrendingPlaylistResponse(
          (long) (index + 1),
          resolveTag(index),
          item.getTitle(),
          item.getChannelTitle(),
          item.getThumbnailUrl(),
          item.getVideoId(),
          item.getRecommendCount()
        );
      })
      .toList();
  }

  public List<CategoryPlaylistResponse> getCategoryPlaylists() {
    return List.of(
      new CategoryPlaylistResponse("EXCITED","😍", "설렘", "가볍고 기분 좋은 인기 플레이리스트"),
      new CategoryPlaylistResponse("SAD","😢", "슬픔", "잔잔한 감성 위주의 인기 음악"),
      new CategoryPlaylistResponse("ANGRY","😡", "화남", "스트레스 해소에 어울리는 강한 비트"),
      new CategoryPlaylistResponse("CALM","😌", "편안", "휴식과 집중에 잘 어울리는 음악")
    );
  }

  public List<CategoryPlaylistVideoResponse> getCategoryPlaylistVideos(String emotionStr) {
    
    // 1. 문자열 -> enum 변환
    EmotionType emotion;
    try{
      emotion = EmotionType.valueOf(emotionStr);
    }catch (IllegalArgumentException e){
      throw new IllegalArgumentException("잘못된 감정 타입입니다: " + emotionStr);
    }

    // 2. 이번 주 범위 계산
    LocalDate today = LocalDate.now();
    LocalDate monday = today.with(DayOfWeek.MONDAY);
    LocalDate nextMonday = monday.plusWeeks(1);

    LocalDateTime start = monday.atStartOfDay();
    LocalDateTime end = nextMonday.atStartOfDay();

    // 3. DB 조회
    List<CategoryPlaylistVideoResponse> results =
      recommendedVideoRepository.findTopVideosByEmotion(
        emotion,
        start,
        end,
        PageRequest.of(0, 8)
      );

    // 4. 결과 그대로 반환
    return results;

  }

  private String resolveTag(int index){
    if(index == 0){
      return "🔥 인기";
    }
    if(index == 1){
      return "⚡ 급상승";
    }
    return "🎧 추천";
  }
}
