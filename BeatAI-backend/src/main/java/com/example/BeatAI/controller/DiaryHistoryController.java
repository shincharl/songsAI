package com.example.BeatAI.controller;

import com.example.BeatAI.config.UserPrincipal;
import com.example.BeatAI.dto.DiaryHistoryDetailResponse;
import com.example.BeatAI.dto.DiaryHistoryResponse;
import com.example.BeatAI.dto.DiaryHistorySearchRequest;
import com.example.BeatAI.dto.RecentDiaryResponse;
import com.example.BeatAI.entity.User;
import com.example.BeatAI.service.DiaryHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/diary")
public class DiaryHistoryController {

  private final DiaryHistoryService diaryHistoryService;

  @GetMapping("/history")
  public List<DiaryHistoryResponse> getHistory(
    @AuthenticationPrincipal UserPrincipal userPrincipal,
    @ModelAttribute DiaryHistorySearchRequest request
    ) {
    return diaryHistoryService.getHistory(userPrincipal.getUser(), request);
  }

  @GetMapping("/history/recent")
  public ResponseEntity<List<RecentDiaryResponse>> getRecentDiaries(
    @AuthenticationPrincipal UserPrincipal userPrincipal
  ){
    return ResponseEntity.ok(
      diaryHistoryService.getRecentDiaries(userPrincipal.getUser())
    );
  }

  @GetMapping("/history/{diaryId}")
  public ResponseEntity<DiaryHistoryDetailResponse> getDiaryDetail(
    @PathVariable Long diaryId,
    @AuthenticationPrincipal UserPrincipal userPrincipal
  ) {
    return ResponseEntity.ok(
      diaryHistoryService.getDiaryDetail(userPrincipal.getUser(), diaryId)
    );
  }
}
