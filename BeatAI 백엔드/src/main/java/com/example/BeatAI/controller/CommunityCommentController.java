package com.example.BeatAI.controller;

import com.example.BeatAI.config.UserPrincipal;
import com.example.BeatAI.dto.CommunityCommentCreateRequest;
import com.example.BeatAI.dto.CommunityCommentResponse;
import com.example.BeatAI.service.CommunityCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/community/posts")
public class CommunityCommentController {

  private final CommunityCommentService communityCommentService;

  @GetMapping("/{postId}/comments")
  public List<CommunityCommentResponse> getComments(@PathVariable Long postId){
    return communityCommentService.getComments(postId);
  }

  @PostMapping("/{postId}/comments")
  public CommunityCommentResponse createComment(
    @PathVariable Long postId,
    @RequestBody CommunityCommentCreateRequest request,
    Authentication authentication
    ){
    UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

    return communityCommentService.createComment(postId, request, userPrincipal);
  }

}
