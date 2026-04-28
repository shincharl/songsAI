package com.example.BeatAI.repository;

import com.example.BeatAI.entity.CommunityEmotion;
import com.example.BeatAI.entity.CommunityPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {

  Page<CommunityPost> findByEmotionOrderByCreatedAtDesc(CommunityEmotion emotion, Pageable pageable);

  Page<CommunityPost> findAllByOrderByCreatedAtDesc(Pageable pageable);

  Page<CommunityPost> findByCreatedAtBetweenOrderByCreatedAtDesc(
    LocalDateTime start,
    LocalDateTime end,
    Pageable pageable
  );

  Page<CommunityPost> findByEmotionAndCreatedAtBetweenOrderByCreatedAtDesc(
    CommunityEmotion emotion,
    LocalDateTime start,
    LocalDateTime end,
    Pageable pageable
  );

}
