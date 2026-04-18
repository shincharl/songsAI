package com.example.BeatAI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CategoryPlaylistResponse {
  private String emotion;
  private String emoji;
  private String title;
  private String subtitle;
}
