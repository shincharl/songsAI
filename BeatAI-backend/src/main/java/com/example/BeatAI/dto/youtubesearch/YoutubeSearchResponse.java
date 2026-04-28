package com.example.BeatAI.dto.youtubesearch;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class YoutubeSearchResponse {
  private List<YoutubeSearchItem> items;
}
