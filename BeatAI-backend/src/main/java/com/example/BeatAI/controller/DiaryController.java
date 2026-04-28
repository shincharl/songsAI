package com.example.BeatAI.controller;

import com.example.BeatAI.config.UserPrincipal;
import com.example.BeatAI.dto.*;
import com.example.BeatAI.entity.Diary;
import com.example.BeatAI.entity.User;
import com.example.BeatAI.service.DiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
    System.out.println("=== /api/diary/analyze 진입 ===");
    System.out.println("request content = " + request.getContent());
    System.out.println("userPrincipal = " + userPrincipal);
    Diary saved = diaryService.saveAndAnalyze(
      userPrincipal.getUser(),
      request
    );

    System.out.println("saved diaryId = " + saved.getId());

    return ResponseEntity.ok(Map.of(
      "success", true,
      "message", "저장 및 분석이 완료되었습니다.",
      "diaryId", saved.getId()
    ));
  }

  // 7일간 감정 분석 결과 반환 메서드
  @GetMapping("/weekly-emotions")
  public ResponseEntity<List<WeeklyEmotionResponse>> getWeeklyEmotions(
    @AuthenticationPrincipal UserPrincipal userPrincipal
  ){
    return ResponseEntity.ok(
      diaryService.getWeeklyEmotions(userPrincipal.getUser())
    );
  }

  // 오늘의 일기 데이터 텍스트 뽑아오는 메서드
  @GetMapping("/today")
  public ResponseEntity<?> getTodayDiaryPreview(
    @AuthenticationPrincipal UserPrincipal userPrincipal
  ){
    User user = userPrincipal.getUser();
    return ResponseEntity.ok(diaryService.getTodayDiaryPreview(user));
  }

  @GetMapping("/calendar")
  public ResponseEntity<List<DiaryCalendarResponse>> getMonthlyCalendar(
    @AuthenticationPrincipal UserPrincipal userPrincipal,
    @RequestParam int year,
    @RequestParam int month
  ) {
    User user = userPrincipal.getUser();

    List<DiaryCalendarResponse> result =
        diaryService.getMonthlyCalendar(user, year, month);

    return ResponseEntity.ok(result);
  }

  @GetMapping("/{diaryId}/music")
  public MusicRecommendationResponse getMusic(
    @AuthenticationPrincipal UserPrincipal userPrincipal,
    @PathVariable Long diaryId
  ) {
    return diaryService.getRecommendedMusic(userPrincipal.getUser(), diaryId);
  }
  
  // 7일 감정 그래프 내용 가져오기
  @GetMapping("/weekly-trend")
  public ResponseEntity<List<DayEmotionTrendResponse>> getWeeklyTrend(
    @AuthenticationPrincipal UserPrincipal userPrincipal
  ){
    User user = userPrincipal.getUser();
    return ResponseEntity.ok(diaryService.getWeeklyEmotionTrend(user));
  }

  // AI 한테 7일 감정 비교해달라고 하기
  @GetMapping("/weekly-insight")
  public ResponseEntity<WeeklyInsightResponse> getWeeklyInsight(
    @AuthenticationPrincipal UserPrincipal userPrincipal
  ){
    User user = userPrincipal.getUser();
    return ResponseEntity.ok(diaryService.getWeeklyInsight(user));
  }

}
