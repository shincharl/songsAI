package com.example.BeatAI.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class TokenDto {
  private String accessToken;
  private String refreshToken;
  private boolean firstLogin;
  private String username;
}
