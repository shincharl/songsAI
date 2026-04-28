package com.example.BeatAI.dto;

import lombok.Getter;

@Getter
public class VerifyRequest {
  private String email;
  private String code;
}
