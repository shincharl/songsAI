package com.example.BeatAI.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Optional;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(
  name = "post_reaction",
  uniqueConstraints  = {
    @UniqueConstraint(columnNames = {"post_id", "user_id"})
  }
)
public class PostReaction {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "post_id")
  private CommunityPost post;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id")
  private User user;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private ReactionType reactionType;

  @Column(nullable = false)
  private LocalDateTime createdAt;


  @PrePersist
  protected void onCreate() {
    this.createdAt = LocalDateTime.now();
  }

  public void changeReaction(ReactionType reactionType){
    this.reactionType = reactionType;
  }
}
