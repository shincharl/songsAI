package com.example.BeatAI.dto.youtubesearch;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class YoutubeSearchItem {
  private YoutubeVideoId id;
  private YoutubeSnippet snippet;
}
