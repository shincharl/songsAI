package com.example.BeatAI.dto;

import com.example.BeatAI.entity.CommunityEmotion;
import com.example.BeatAI.entity.ReactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class CommunityPostResponse {

    private Long id;
    private String nickname;
    private String content;
    private CommunityEmotion emotion;
    private LocalDateTime createdAt;
    private ReactionSummaryResponse reactionSummary;
    private ReactionType myReaction;
}
