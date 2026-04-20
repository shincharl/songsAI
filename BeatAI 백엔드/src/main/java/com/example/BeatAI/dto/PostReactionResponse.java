package com.example.BeatAI.dto;

import com.example.BeatAI.entity.ReactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class PostReactionResponse {

    private Long postId;
    private ReactionType myReaction;
    private ReactionSummaryResponse reactionSummary;
}
