package com.example.BeatAI.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class EmotionLog {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
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

  /*
  * 감정 데이터 저장 메서드
  * */
  public static EmotionLog create(Diary diary, EmotionType emotion, Double score){
    EmotionLog log = new EmotionLog();
    log.diary = diary;
    log.emotion = emotion;
    log.score = score;
    return log;
  }

}
