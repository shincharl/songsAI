package com.example.BeatAI.service;

import com.example.BeatAI.dto.DiaryHistoryDetailResponse;
import com.example.BeatAI.dto.DiaryHistoryResponse;
import com.example.BeatAI.dto.DiaryHistorySearchRequest;
import com.example.BeatAI.dto.RecentDiaryResponse;
import com.example.BeatAI.entity.Diary;
import com.example.BeatAI.entity.EmotionLog;
import com.example.BeatAI.entity.User;
import com.example.BeatAI.repository.DiaryRepository;
import com.example.BeatAI.repository.EmotionLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiaryHistoryService {

  private final DiaryRepository diaryRepository;
  private final EmotionLogRepository emotionLogRepository;

  public List<DiaryHistoryResponse> getHistory(User user, DiaryHistorySearchRequest request) {
    LocalDate firstDay = LocalDate.of(request.getYear(), request.getMonth(), 1);
    LocalDateTime start = firstDay.atStartOfDay();
    LocalDateTime end = firstDay.plusMonths(1).atStartOfDay();

    return diaryRepository.searchHistory(user, start, end, request);
  }

  public DiaryHistoryDetailResponse getDiaryDetail(User user, Long diaryId) {
    Diary diary = diaryRepository.findByIdAndUser(diaryId, user)
      .orElseThrow(() -> new RuntimeException("해당 일기를 찾을 수 없습니다."));

    String topEmotion = emotionLogRepository.findTopByDiaryOrderByScoreDesc(diary)
      .map(emotionLog -> emotionLog.getEmotion().name())
      .orElse("NEUTRAL");

    String date = diary.getCreatedAt()
      .toLocalDate()
      .format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));

      return new DiaryHistoryDetailResponse(
        diary.getId(),
        date,
        topEmotion,
        diary.getContent()
      );
  }

  public List<RecentDiaryResponse> getRecentDiaries(User user) {
    return diaryRepository.findTop3ByUserOrderByCreatedAtDesc(user)
      .stream()
      .map(diary -> {
        EmotionLog topEmotionLog = emotionLogRepository
          .findTopByDiaryOrderByScoreDesc(diary)
          .orElse(null);

        return RecentDiaryResponse.from(diary, topEmotionLog);
      })
      .toList();
  }

}
