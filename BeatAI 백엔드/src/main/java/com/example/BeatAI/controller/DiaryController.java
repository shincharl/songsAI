package com.example.BeatAI.controller;

import com.example.BeatAI.config.UserPrincipal;
import com.example.BeatAI.dto.DiaryAnalyzeRequest;
import com.example.BeatAI.entity.Diary;
import com.example.BeatAI.service.DiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/diary")
public class DiaryController {

  private final DiaryService diaryService;

  @PostMapping("/analyze")
  public ResponseEntity<?> analyzeDiary(
    @RequestBody DiaryAnalyzeRequest request,
    @AuthenticationPrincipal UserPrincipal userPrincipal
    ){
    Diary saved = diaryService.saveAndAnalyze(
      userPrincipal.getUser(),
      request.getText()
    );

    return ResponseEntity.ok(Map.of(
      "success", true,
      "message", "저장 및 분석이 완료되었습니다.",
      "diaryId", saved.getId()
    ));
  }
}
