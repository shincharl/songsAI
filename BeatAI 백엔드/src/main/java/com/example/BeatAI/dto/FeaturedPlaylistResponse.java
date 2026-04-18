package com.example.BeatAI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FeaturedPlaylistResponse {

  private String badge;
  private String title;
  private String description;
  private String thumbnailUrl;
  private String channelTitle;
  private String videoId;
  private long recommendCount;

}
