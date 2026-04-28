package com.example.BeatAI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class KakaoUserInfoDto {
  private Long kakaoId;
  private String nickname;
  private String profileImageUrl;
}
