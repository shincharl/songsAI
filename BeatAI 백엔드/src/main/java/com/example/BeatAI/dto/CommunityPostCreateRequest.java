package com.example.BeatAI.dto;

import com.example.BeatAI.entity.CommunityEmotion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CommunityPostCreateRequest {

  @NotBlank(message = "내용은 비어 있을 수 없습니다.")
  @Size(max = 500, message = "내용은 500자 이하여야 합니다.")
  private String content;

  @NotNull(message = "감정은 필수입니다.")
  private CommunityEmotion emotion;
}
