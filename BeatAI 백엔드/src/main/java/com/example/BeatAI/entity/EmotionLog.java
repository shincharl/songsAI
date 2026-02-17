package com.example.BeatAI.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class EmotionLog {

  @Id @GeneratedValue
  @Column(name = "EMOTIONLOG_ID")
  private Long id;

  @JsonBackReference
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "DIARY_ID", nullable = false)
  private Diary diary;

  @Enumerated(EnumType.STRING)
  private EmotionType emotion;

  private Double score;

  @Column(updatable = false)
  private LocalDateTime createdAt;
  
  /* timestamp 자동 생성 추가 */
  @PrePersist
  void prePersist(){
    this.createdAt = LocalDateTime.now();
  }
}
