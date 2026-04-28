package com.example.BeatAI.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedVideo {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String videoId;

  @Column(columnDefinition = "TEXT")
  private String title;

  private String channelTitle;

  @Column(columnDefinition = "TEXT")
  private String thumbnailUrl;

  @ManyToOne(fetch = FetchType.LAZY)
  private User user;

  private LocalDateTime createdAt;

  @PrePersist
  public void prePersist() {
    this.createdAt = LocalDateTime.now();
  }
}
