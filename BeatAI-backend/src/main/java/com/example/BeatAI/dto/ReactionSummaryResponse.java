package com.example.BeatAI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReactionSummaryResponse {
  private long empathyCount;
  private long comfortCount;
  private long cheerCount;
}
