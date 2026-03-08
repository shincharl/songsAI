package com.example.BeatAI.service;

import com.example.BeatAI.dto.*;
import com.example.BeatAI.entity.*;
import com.example.BeatAI.repository.DiaryRepository;
import com.example.BeatAI.repository.DiaryStickerRepository;
import com.example.BeatAI.repository.EmotionLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Transactional
@Service
@RequiredArgsConstructor
public class DiaryService {

  private final DiaryRepository diaryRepository;
  private final EmotionLogRepository emotionLogRepository;
  private final EmotionAnalysisService emotionAnalysisService;
  private final DiaryStickerRepository diaryStickerRepository;

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
            diary.getContent(),
            stickers
          );
        })
        .orElse(new TodayDiaryPreviewResponse("", List.of()));
  }
  
  // 캘린더 날짜별로 묶어서 일기 정보 내보내기
  public List<DiaryCalendarResponse> getMonthlyCalendar(User user, int year, int month){
    LocalDate firstDay = LocalDate.of(year, month, 1);

    LocalDateTime start = firstDay.atStartOfDay();
    LocalDateTime end = firstDay
      .withDayOfMonth(firstDay.lengthOfMonth())
      .atTime(23, 59,59);

    List<Diary> diaries = diaryRepository.findAllByUserAndCreatedAtBetween(user, start, end);

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
}
