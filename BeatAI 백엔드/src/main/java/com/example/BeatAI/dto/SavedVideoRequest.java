package com.example.BeatAI.dto;

import lombok.Getter;

@Getter
public class SavedVideoRequest {
  private String videoId;
  private String title;
  private String channelTitle;
  private String thumbnailUrl;

}
