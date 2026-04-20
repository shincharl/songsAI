package com.example.BeatAI.repository;

import com.example.BeatAI.entity.CommunityEmotion;
import com.example.BeatAI.entity.CommunityPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {

  Page<CommunityPost> findByEmotionOrderByCreatedAtDesc(CommunityEmotion emotion, Pageable pageable);

  Page<CommunityPost> findAllByOrderByCreatedAtDesc(Pageable pageable);

}
