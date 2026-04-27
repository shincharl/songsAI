package com.example.BeatAI.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SavedVideoResponse {
  private Long id;
  private String videoId;
  private String title;
  private String channelTitle;
  private String thumbnailUrl;
}
