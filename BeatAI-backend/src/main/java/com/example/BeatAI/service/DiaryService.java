package com.example.BeatAI.service;

import com.example.BeatAI.dto.*;
import com.example.BeatAI.entity.*;
import com.example.BeatAI.repository.DiaryRepository;
import com.example.BeatAI.repository.DiaryStickerRepository;
import com.example.BeatAI.repository.EmotionLogRepository;
import com.example.BeatAI.repository.RecommendedVideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Transactional
@Service
@RequiredArgsConstructor
public class DiaryService {

  private final DiaryRepository diaryRepository;
  private final EmotionLogRepository emotionLogRepository;
  private final EmotionAnalysisService emotionAnalysisService;
  private final DiaryStickerRepository diaryStickerRepository;
  private final AiMusicQueryService aiMusicQueryService;
  private final YoutubeService youtubeService;
  private final RecommendedVideoRepository recommendedVideoRepository;

  public Diary saveAndAnalyze(User user, DiaryAnalyzeRequest request) {

    String content = request.getContent();

    LocalDate today = LocalDate.now();
    LocalDateTime start = today.atStartOfDay();
    LocalDateTime end = today.plusDays(1).atStartOfDay();

    // 오늘 일기 있으면 업데이트, 없으면 생성
    Diary diary = diaryRepository
      .findFirstByUserAndCreatedAtBetween(user, start, end)
      .orElseGet(() -> Diary.create(user, content));

    if (diary.getId() != null){
      diary.updateContent(content); // 기존이면 덮어쓰기
    } 
    
    // 2. 저장(신규면 INSERT, 기존이면 UPDATE or 그냥 flush 대상)
    Diary saved = diaryRepository.save(diary);

    // 감정 로그는 덮어쓰기: 기존 삭제
    emotionLogRepository.deleteByDiary(saved);
    
    // 감정 분석
    Map<EmotionType, Double> analysis = emotionAnalysisService.analyze(content);

    // 새 감정 로그 저장
    for (Map.Entry<EmotionType, Double> entry : analysis.entrySet()) {
      EmotionLog log = EmotionLog.create(saved, entry.getKey(), entry.getValue());
      emotionLogRepository.save(log);
    }
    
    // 기존 스티커 삭제
    diaryStickerRepository.deleteByDiary(saved);
    
    // 새 스티커 저장
    if (request.getStickers() != null && !request.getStickers().isEmpty()) {
      List<DiarySticker> stickers = request.getStickers().stream()
        .map(stickerRequest -> DiarySticker.create(
            saved,
          stickerRequest.getCategory(),
          stickerRequest.getLabel(),
          stickerRequest.getImg(),
          stickerRequest.getPage()
        ))
        .toList();

      diaryStickerRepository.saveAll(stickers);
    }

    // 추천 음악이 아직 없을 때만 생성
    if(!saved.hasMusicRecommendation()){
      try {
        String musicMessage = aiMusicQueryService.createMusicMessage(content);
        String musicQuery = youtubeService.createSearchQueryFromMessage(musicMessage);
        List<YoutubeVideoItemResponse> videos = youtubeService.searchVideos(musicQuery);

        saved.updateMusicRecommendation(musicMessage, musicQuery);

        recommendedVideoRepository.deleteByDiary(saved);

        List<RecommendedVideo> recommendedVideos = new ArrayList<>();
        for (int i = 0; i < videos.size(); i++) {
          YoutubeVideoItemResponse video = videos.get(i);

          recommendedVideos.add(
            RecommendedVideo.create(
              saved,
              video.getVideoId(),
              video.getTitle(),
              video.getChannelTitle(),
              video.getThumbnailUrl(),
              i + 1
            )
          );
        }

        recommendedVideoRepository.saveAll(recommendedVideos);
      } catch (Exception e) {
        System.out.println("추천 음악 저장 실패: " + e.getMessage());
      }
    }

    return saved;
  }

  public List<WeeklyEmotionResponse> getWeeklyEmotions(User user){
    // 최근 7일 데이터 조회
    LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);

    List<EmotionLog> logs = emotionLogRepository.findByDiaryUserAndDiaryCreatedAtAfter(user, weekAgo);

    // 감정별 점수 합산
    Map<EmotionType, Double> emotionSum = new HashMap<>();

    for (EmotionLog log : logs) {
      emotionSum.merge(
          log.getEmotion(),
          log.getScore(),
          Double::sum
      );
    }
    
    // 그래프용 (없는 감정도 0으로 넣기)
    for (EmotionType type : EmotionType.values()) {
        emotionSum.putIfAbsent(type, 0.0);
    }

    return emotionSum.entrySet()
      .stream()
      .map(entry ->
        new WeeklyEmotionResponse(
          entry.getKey().name(),
          entry.getValue()
        )
      ).toList();
  }

  public TodayDiaryPreviewResponse getTodayDiaryPreview(User user){
      LocalDate today = LocalDate.now();
      LocalDateTime start = today.atStartOfDay();
      LocalDateTime end = today.plusDays(1).atStartOfDay();

      return diaryRepository
        .findFirstByUserAndCreatedAtBetween(user, start, end)
        .map(diary -> {
          List<String> stickers = diaryStickerRepository.findByDiary(diary).stream()
            .map(DiarySticker::getLabel)
            .toList();

          return new TodayDiaryPreviewResponse(
            diary.getId(),
            diary.getContent(),
            stickers
          );
        })
        .orElse(new TodayDiaryPreviewResponse(null, "", List.of()));
  }
  
  // 캘린더 날짜별로 묶어서 일기 정보 내보내기
  public List<DiaryCalendarResponse> getMonthlyCalendar(User user, int year, int month){
    LocalDate firstDay = LocalDate.of(year, month, 1);

    LocalDateTime start = firstDay.atStartOfDay();
    LocalDateTime end = firstDay.plusMonths(1).atStartOfDay();

    List<Diary> diaries = diaryRepository.findAllByUserAndCreatedAtGreaterThanEqualAndCreatedAtLessThan(user, start, end);

    return diaries.stream()
      .map(diary -> {
        EmotionLog topEmotionLog = emotionLogRepository
          .findTopByDiaryOrderByScoreDesc(diary)
          .orElse(null);

        String preview = diary.getContent();
        if (preview != null && preview.length() > 12) {
          preview = preview.substring(0, 12) + "...";
        }

        return new DiaryCalendarResponse(
          diary.getId(),
          diary.getCreatedAt().toLocalDate().toString(),
          preview,
          topEmotionLog != null ? topEmotionLog.getEmotion().name() : null,
          topEmotionLog != null ? topEmotionLog.getScore() : null
        );
      })
      .toList();
  }

  public MusicRecommendationResponse getRecommendedMusic(User user, Long diaryId){
      Diary diary = diaryRepository.findById(diaryId)
        .orElseThrow(() -> new IllegalArgumentException("일기를 찾을 수 없습니다."));

      if (!diary.getUser().getId().equals(user.getId())){
        throw new IllegalStateException("해당 일기에 접근할 수 없습니다.");
      }

    List<RecommendedVideo> savedVideos = recommendedVideoRepository.findByDiaryOrderBySortOrderAsc(diary);

    List<YoutubeVideoItemResponse> videos = savedVideos.stream()
      .map(video -> new YoutubeVideoItemResponse(
        video.getVideoId(),
        video.getTitle(),
        video.getChannelTitle(),
        video.getThumbnailUrl()
      ))
      .toList();

    String moodTitle = "AI가 고른 오늘의 무드";
    String moodDesc = diary.getMusicMessage() != null && !diary.getMusicMessage().isBlank()
      ? diary.getMusicMessage()
      : "오늘 마음에 어울리는 노래를 골라봤어";

    return new MusicRecommendationResponse(
      moodTitle,
      moodDesc,
      videos
    );
  }

  @Transactional(readOnly = true)
  public List<DayEmotionTrendResponse> getWeeklyEmotionTrend(User user){

    LocalDate today = LocalDate.now();
    LocalDate startDate = today.minusDays(6);

    LocalDateTime start = startDate.atStartOfDay();
    LocalDateTime end = today.plusDays(1).atStartOfDay();
    
    // 최근 7일 일기 조회
    List<Diary> diaries = diaryRepository
      .findAllByUserAndCreatedAtBetweenOrderByCreatedAtAsc(user, start, end);

    // 날짜별로 매핑 (중복 방지)
    Map<LocalDate, Diary> diaryMap = diaries.stream()
      .collect(Collectors.toMap(
          d -> d.getCreatedAt().toLocalDate(),
          d -> d
      ));

    List<DayEmotionTrendResponse> result = new ArrayList<>();

    // 7일 루프 (빈 날짜도 채움)
    for (int i = 0; i < 7; i++) {
      LocalDate date = startDate.plusDays(i);

      Diary diary = diaryMap.get(date);
      
      if (diary == null) {
        // 일기 없는 날
        result.add(new DayEmotionTrendResponse(
          getKorDayOfWeek(date),
          3.0,
          "🙂",
          "기록 없음",
          date.toString()
        ));
        continue;
      }

      // 해당 diary의 최고 감정
      Optional<EmotionLog> topEmotionLogOpt =
        emotionLogRepository.findTopByDiaryOrderByScoreDesc(diary);

      if (topEmotionLogOpt.isEmpty()){
        result.add(new DayEmotionTrendResponse(
          getKorDayOfWeek(date),
          3.0,
          "🙂",
          "보통",
          date.toString()
        ));
        continue;
      }

      EmotionType emotion = topEmotionLogOpt.get().getEmotion();

      result.add(new DayEmotionTrendResponse(
        getKorDayOfWeek(date),
        toChartScore(emotion),
        toEmoji(emotion),
        toLabel(emotion),
        date.toString()
      ));
    }

    return result;
  }
  
  // 한국어 날짜 변환 메서드
  private String getKorDayOfWeek(LocalDate date){
    return switch (date.getDayOfWeek()) {
      case MONDAY -> "월";
      case TUESDAY -> "화";
      case WEDNESDAY -> "수";
      case THURSDAY -> "목";
      case FRIDAY -> "금";
      case SATURDAY -> "토";
      case SUNDAY -> "일";
    };
  }
  
  // Emotion 변환 함수
  private double toChartScore(EmotionType emotion){
    return switch (emotion) {
      case SAD -> 1.5;
      case ANGRY -> 1.8;
      case NEUTRAL -> 3.0;
      case CALM -> 3.6;
      case HAPPY -> 4.3;
      case EXCITED -> 4.8;
    };
  }

  private String toEmoji(EmotionType emotion){
    return switch (emotion) {
      case SAD -> "😢";
      case ANGRY -> "😠";
      case NEUTRAL -> "🙂";
      case CALM -> "😌";
      case HAPPY -> "😊";
      case EXCITED -> "🤩";
    };
  }

  private String toLabel(EmotionType emotion){
    return switch (emotion) {
      case SAD -> "슬픔";
      case ANGRY -> "화남";
      case NEUTRAL -> "보통";
      case CALM -> "차분함";
      case HAPPY -> "행복";
      case EXCITED -> "신남";
    };
  }
  
  // AI 7일치 감정 상태 분석 및 따뜻한 한마디 가져오는 메서드
  public WeeklyInsightResponse getWeeklyInsight(User user){
    List<DayEmotionTrendResponse> trend = getWeeklyEmotionTrend(user);

    if (trend == null || trend.isEmpty()){
      return new WeeklyInsightResponse("최근 7일 감정 데이터가 아직 충분하지 않아요.");
    }

    String insight = aiMusicQueryService.generateWeeklyInsight(trend);

    return new WeeklyInsightResponse(insight);
  }
}
