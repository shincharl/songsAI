package com.example.BeatAI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FeaturedPlaylistQueryDto {

  private String videoId;
  private String title;
  private String channelTitle;
  private String thumbnailUrl;
  private long recommendCount;

}
