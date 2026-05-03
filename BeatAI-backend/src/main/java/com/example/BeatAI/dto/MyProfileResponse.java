package com.example.BeatAI.dto;

public record MyProfileResponse (
  Long id,
  String email,
  String nickname,
  String profileImageUrl
) {
}
