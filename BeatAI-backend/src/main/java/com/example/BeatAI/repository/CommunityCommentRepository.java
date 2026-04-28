package com.example.BeatAI.repository;

import com.example.BeatAI.entity.CommunityComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommunityCommentRepository extends JpaRepository<CommunityComment, Long> {

  // 게시물 목록 조회 후 오름차순 댓글 조회
  List<CommunityComment> findByPostIdOrderByCreatedAtAsc(Long postId);
  
  // 댓글 수 조회
  long countByPostId(Long postId);

}
