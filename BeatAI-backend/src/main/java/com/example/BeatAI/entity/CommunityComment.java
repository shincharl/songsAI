package com.example.BeatAI.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Fetch;

import java.time.LocalDateTime;

@Entity
@Table(name = "community_comment")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityComment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // 어떤 게시글의 댓글인지
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "post_id", nullable = false)
  private CommunityPost post;

  // 누가 썼는지
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  // 댓글 내용
  @Column(nullable = false, length = 300)
  private String content;

  private LocalDateTime createdAt;

  @PrePersist
  public void prePersist() {
    this.createdAt = LocalDateTime.now();
  }
}
