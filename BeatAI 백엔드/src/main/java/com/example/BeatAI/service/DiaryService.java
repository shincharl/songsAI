package com.example.BeatAI.service;

import com.example.BeatAI.entity.Diary;
import com.example.BeatAI.entity.EmotionLog;
import com.example.BeatAI.entity.EmotionType;
import com.example.BeatAI.entity.User;
import com.example.BeatAI.repository.DiaryRepository;
import com.example.BeatAI.repository.EmotionLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Transactional
@Service
@RequiredArgsConstructor
public class DiaryService {

  private final DiaryRepository diaryRepository;
  private final EmotionLogRepository emotionLogRepository;
  private final EmotionAnalysisService emotionAnalysisService;

  public Diary saveAndAnalyze(User user, String content) {

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

    return saved;
  }
}
