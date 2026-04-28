package com.example.BeatAI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CategoryPlaylistVideoResponse {

  private Long id;
  private String title;
  private String channelTitle;
  private String thumbnailUrl;
  private String videoId;
  private long recommendCount;
}
