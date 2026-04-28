package com.example.BeatAI.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class DiaryAnalyzeRequest {
  private String content;
  private List<String> pages;
  private List<DiaryStickerRequest> stickers;
}
