package com.example.BeatAI.controller;

import com.example.BeatAI.config.UserPrincipal;
import com.example.BeatAI.dto.DiaryHistoryResponse;
import com.example.BeatAI.entity.User;
import com.example.BeatAI.service.DiaryHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/history")
public class DiaryHistoryController {

  private final DiaryHistoryService diaryHistoryService;

  @GetMapping("/month-all")
  public ResponseEntity<List<DiaryHistoryResponse>> getHistory(
    @AuthenticationPrincipal UserPrincipal userPrincipal,
    @RequestParam int year,
    @RequestParam int month
    ){
    User user = userPrincipal.getUser();
    return ResponseEntity.ok(
        diaryHistoryService.getDiaryHistory(user, year, month)
    );
  }
}
