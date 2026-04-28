package com.example.BeatAI.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SignInResponseDto {
  private String accessToken;
  private boolean firstLogin; // 닉네임 설정 필요
  private String nickname;
}
