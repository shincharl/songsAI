package com.example.BeatAI.controller;

import com.example.BeatAI.config.UserPrincipal;
import com.example.BeatAI.dto.CommunityPostCreateRequest;
import com.example.BeatAI.dto.CommunityPostResponse;
import com.example.BeatAI.dto.PostReactionRequest;
import com.example.BeatAI.dto.PostReactionResponse;
import com.example.BeatAI.entity.CommunityEmotion;
import com.example.BeatAI.service.CommunityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/community/posts")
@RequiredArgsConstructor
public class CommunityController {

  private final CommunityService communityService;

  @PostMapping
  public CommunityPostResponse createPost(
    @AuthenticationPrincipal UserPrincipal userPrincipal,
    @RequestBody @Valid CommunityPostCreateRequest request
    ){
    return communityService.createPost(userPrincipal.getId(), request);
  }

  @GetMapping
  public Page<CommunityPostResponse> getPosts(
    @AuthenticationPrincipal UserPrincipal userPrincipal,
    @RequestParam(required = false) CommunityEmotion emotion,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size
    ){

    Long userId = userPrincipal != null ? userPrincipal.getId() : null;

    return communityService.getPosts(
      userId,
      emotion,
      PageRequest.of(page, size)
    );
  }

  @PostMapping("/{postId}/reactions")
  public PostReactionResponse reactToPost(
    @AuthenticationPrincipal UserPrincipal userPrincipal,
    @PathVariable Long postId,
    @RequestBody @Valid PostReactionRequest request
    ){
    return communityService.reactToPost(userPrincipal.getId(), postId, request);
  }
}
