package com.example.BeatAI.service;

import com.example.BeatAI.config.UserPrincipal;
import com.example.BeatAI.dto.CommunityCommentCreateRequest;
import com.example.BeatAI.dto.CommunityCommentResponse;
import com.example.BeatAI.entity.CommunityComment;
import com.example.BeatAI.entity.CommunityPost;
import com.example.BeatAI.entity.User;
import com.example.BeatAI.repository.CommunityCommentRepository;
import com.example.BeatAI.repository.CommunityPostRepository;
import com.example.BeatAI.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommunityCommentService {

  private final CommunityCommentRepository communityCommentRepository;
  private final CommunityPostRepository communityPostRepository;
  private final UserRepository userRepository;

  public List<CommunityCommentResponse> getComments(Long postId) {
    return communityCommentRepository.findByPostIdOrderByCreatedAtAsc(postId)
      .stream()
      .map(comment -> CommunityCommentResponse.builder()
        .id(comment.getId())
        .postId(comment.getPost().getId())
        .nickname(comment.getUser().getNickname())
        .content(comment.getContent())
        .createdAt(comment.getCreatedAt())
        .build())
      .toList();
  }

  @Transactional
  public CommunityCommentResponse createComment(Long postId, CommunityCommentCreateRequest request, UserPrincipal userPrincipal){
    CommunityPost post = communityPostRepository.findById(postId)
      .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));

    User user = userPrincipal.getUser();

    CommunityComment comment = CommunityComment.builder()
      .post(post)
      .user(user)
      .content(request.getContent())
      .build();

    CommunityComment saved = communityCommentRepository.save(comment);

    return CommunityCommentResponse.builder()
      .id(saved.getId())
      .postId(post.getId())
      .nickname(user.getNickname())
      .content(saved.getContent())
      .createdAt(saved.getCreatedAt())
      .build();

  }
}
