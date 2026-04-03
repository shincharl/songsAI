package com.example.BeatAI.service;

import com.example.BeatAI.dto.DiaryHistoryResponse;
import com.example.BeatAI.entity.Diary;
import com.example.BeatAI.entity.EmotionLog;
import com.example.BeatAI.entity.User;
import com.example.BeatAI.repository.DiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiaryHistoryService {

  private final DiaryRepository diaryRepository;

  public List<DiaryHistoryResponse> getDiaryHistory(User user, int year, int month){

    // 해당 월 시작 / 끝 계산
    LocalDate startDate = LocalDate.of(year, month, 1);
    LocalDate endDate = startDate.plusMonths(1);

    LocalDateTime start = startDate.atStartOfDay();
    LocalDateTime end = endDate.atStartOfDay();

    // DB 조회
    List<Diary> diaries = diaryRepository
      .findAllByUserAndCreatedAtBetween(user, start, end);
    
    // DTO 변환
    return diaries.stream()
      .map(diary -> {
        
        // 미리보기
        String preview = diary.getContent().length() > 30
          ? diary.getContent().substring(0, 30) + "..."
          : diary.getContent();
        
        // 대표 감정 (score 가장 높은 것)
        EmotionLog topEmotion = diary.getEmotionLogs().stream()
          .max(Comparator.comparing(EmotionLog::getScore))
          .orElse(null);

        return new DiaryHistoryResponse(
          diary.getId(),
          diary.getCreatedAt().toLocalDate().toString(),
          preview,
          topEmotion != null ? topEmotion.getEmotion().name() : null
        );
      })
      .toList();
  }
}
