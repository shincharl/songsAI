package com.example.BeatAI.repository;

import com.example.BeatAI.dto.DiaryHistoryResponse;
import com.example.BeatAI.dto.DiaryHistorySearchRequest;
import com.example.BeatAI.entity.Diary;
import com.example.BeatAI.entity.User;

import java.time.LocalDateTime;
import java.util.List;

public interface DiaryRepositoryCustom {
  List<DiaryHistoryResponse> searchHistory(
    User user,
    LocalDateTime start,
    LocalDateTime end,
    DiaryHistorySearchRequest request
  );
}
