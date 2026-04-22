package com.example.BeatAI.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CommunityCommentResponse {
    private Long id;
    private Long postId;
    private String nickname;
    private String content;
    private LocalDateTime createdAt;

}
