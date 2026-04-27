package com.example.BeatAI.controller;

import com.example.BeatAI.config.UserPrincipal;
import com.example.BeatAI.dto.SavedVideoRequest;
import com.example.BeatAI.dto.SavedVideoResponse;
import com.example.BeatAI.service.SavedVideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/saved-videos")
public class SavedVideoController {

  private final SavedVideoService savedVideoService;

  @PostMapping
  public ResponseEntity<Void> save(
    @AuthenticationPrincipal UserPrincipal principal,
    @RequestBody SavedVideoRequest request
    ){
    savedVideoService.save(principal.getUser(), request);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/{videoId}")
  public ResponseEntity<Void> delete(
    @AuthenticationPrincipal UserPrincipal principal,
    @PathVariable String videoId
  ) {
    savedVideoService.delete(principal.getUser(), videoId);
    return ResponseEntity.noContent().build();
  }

  @GetMapping
  public ResponseEntity<List<SavedVideoResponse>> getMySavedVideos(
    @AuthenticationPrincipal UserPrincipal principal
  ) {
    return ResponseEntity.ok(
      savedVideoService.getMySavedVideos(principal.getUser())
    );
  }
}
