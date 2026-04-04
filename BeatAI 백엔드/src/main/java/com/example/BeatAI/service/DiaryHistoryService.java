package com.example.BeatAI.service;

import com.example.BeatAI.dto.DiaryHistoryResponse;
import com.example.BeatAI.dto.DiaryHistorySearchRequest;
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

  public List<DiaryHistoryResponse> getHistory(User user, DiaryHistorySearchRequest request) {
    LocalDate firstDay = LocalDate.of(request.getYear(), request.getMonth(), 1);
    LocalDateTime start = firstDay.atStartOfDay();
    LocalDateTime end = firstDay.plusMonths(1).atStartOfDay();

    return diaryRepository.searchHistory(user, start, end, request);
  }
}
