package com.example.BeatAI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class MusicRecommendationResponse {
  private String moodTitle;
  private String moodDesc;
  private List<YoutubeVideoItemResponse> videos;
}
