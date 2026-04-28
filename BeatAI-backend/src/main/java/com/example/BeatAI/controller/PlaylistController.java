package com.example.BeatAI.controller;

import com.example.BeatAI.dto.CategoryPlaylistResponse;
import com.example.BeatAI.dto.CategoryPlaylistVideoResponse;
import com.example.BeatAI.dto.FeaturedPlaylistResponse;
import com.example.BeatAI.dto.TrendingPlaylistResponse;
import com.example.BeatAI.service.PlaylistService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/playlists")
@RequiredArgsConstructor
public class PlaylistController {

  private final PlaylistService playlistService;

  // 이번 주 인기 TOP 1
  @GetMapping("/featured")
  public ResponseEntity<FeaturedPlaylistResponse> getFeaturedPlaylist() {
    FeaturedPlaylistResponse response = playlistService.getFeaturedPlaylist();
    return ResponseEntity.ok(response);
  }
  
  // 최근 트랜드 추천 영상 (정렬 5개)
  @GetMapping("/trending")
  public ResponseEntity<List<TrendingPlaylistResponse>> getTrendingPlaylists() {
    List<TrendingPlaylistResponse> response = playlistService.getTrendingPlaylists();
    return ResponseEntity.ok(response);
  }

  @GetMapping("/categories")
  public ResponseEntity<List<CategoryPlaylistResponse>> getCategoryPlaylists() {
    List<CategoryPlaylistResponse> response = playlistService.getCategoryPlaylists();
    return ResponseEntity.ok(response);
  }

  @GetMapping("/categories/{emotion}")
  public ResponseEntity<List<CategoryPlaylistVideoResponse>> getCategoryPlaylistVideos(
    @PathVariable String emotion
  ){
    return ResponseEntity.ok(
      playlistService.getCategoryPlaylistVideos(emotion)
    );
  }
}
