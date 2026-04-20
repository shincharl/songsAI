package com.example.BeatAI.dto;

import com.example.BeatAI.entity.ReactionType;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PostReactionRequest {

  @NotNull(message = "리액션 타입은 필수입니다.")
  private ReactionType reactionType;
}
