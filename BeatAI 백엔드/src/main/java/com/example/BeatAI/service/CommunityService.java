package com.example.BeatAI.service;

import com.example.BeatAI.dto.*;
import com.example.BeatAI.entity.*;
import com.example.BeatAI.repository.CommunityPostRepository;
import com.example.BeatAI.repository.PostReactionRepository;
import com.example.BeatAI.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommunityService {

  private final CommunityPostRepository communityPostRepository;
  private final PostReactionRepository postReactionRepository;
  private final UserRepository userRepository;

  @Transactional
  public CommunityPostResponse createPost(Long userId, CommunityPostCreateRequest request){
    User user = getUser(userId);

    CommunityPost post = CommunityPost.builder()
      .user(user)
      .content(request.getContent())
      .emotion(request.getEmotion())
      .build();

    CommunityPost saved = communityPostRepository.save(post);

    return toResponse(saved, user);

  }

  public Page<CommunityPostResponse> getPosts(Long userId, CommunityEmotion emotion, Pageable pageable){
    User user = null;

    if(userId != null){
      user = getUser(userId);
    }

    LocalDate today = LocalDate.now();
    LocalDateTime start = today.atStartOfDay();
    LocalDateTime end = today.plusDays(1).atStartOfDay();

    Pageable sortedPageable = PageRequest.of(
      pageable.getPageNumber(),
      pageable.getPageSize(),
      Sort.by(Sort.Direction.DESC, "createdAt")
    );

    Page<CommunityPost> posts = (emotion == null)
      ? communityPostRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(
      start,
      end,
      sortedPageable
    )
      : communityPostRepository.findByEmotionAndCreatedAtBetweenOrderByCreatedAtDesc(
      emotion,
      start,
      end,
      sortedPageable
    );

    User finalUser = user;
    return posts.map(post -> toResponse(post, finalUser));
  }

  @Transactional
  public PostReactionResponse reactToPost(Long userId, Long postId, PostReactionRequest request){
    User user = getUser(userId);
    CommunityPost post = getPost(postId);

    PostReaction existingReaction = postReactionRepository.findByPostAndUser(post, user).orElse(null);

    if (existingReaction == null) {
      PostReaction newReaction = PostReaction.builder()
        .post(post)
        .user(user)
        .reactionType(request.getReactionType())
        .build();
      postReactionRepository.save(newReaction);
    } else {
      if (existingReaction.getReactionType() == request.getReactionType()){
        postReactionRepository.delete(existingReaction);
      } else {
        existingReaction.changeReaction(request.getReactionType());
      }
    }

    ReactionType myReaction = postReactionRepository.findByPostAndUser(post, user)
      .map(PostReaction::getReactionType)
      .orElse(null);

    return PostReactionResponse.builder()
      .postId(post.getId())
      .myReaction(myReaction)
      .reactionSummary(getReactionSummary(post))
      .build();

  }

  private CommunityPostResponse toResponse(CommunityPost post, User user){
    ReactionType myReaction = null;

    if(user != null){
      myReaction = postReactionRepository.findByPostAndUser(post, user)
        .map(PostReaction::getReactionType)
        .orElse(null);
    }

    return CommunityPostResponse.builder()
      .id(post.getId())
      .nickname(post.getUser().getNickname())
      .content(post.getContent())
      .emotion(post.getEmotion())
      .createdAt(post.getCreatedAt())
      .reactionSummary(getReactionSummary(post))
      .myReaction(myReaction)
      .build();
  }

  private ReactionSummaryResponse getReactionSummary(CommunityPost post){
    long empathyCount = postReactionRepository.countByPostAndReactionType(post, ReactionType.EMPATHY);
    long comfortCount = postReactionRepository.countByPostAndReactionType(post, ReactionType.COMFORT);
    long cheerCount = postReactionRepository.countByPostAndReactionType(post, ReactionType.CHEER);

    return new ReactionSummaryResponse(empathyCount, comfortCount, cheerCount);
  }

  private User getUser(Long userId){
    return userRepository.findById(userId)
      .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));
  }

  private CommunityPost getPost(Long postId) {
    return communityPostRepository.findById(postId)
      .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));
  }
}
