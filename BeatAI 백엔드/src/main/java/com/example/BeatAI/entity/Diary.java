package com.example.BeatAI.entity;


import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
public class Diary {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "DIARY_ID")
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "USER_ID", nullable = false)
  private User user;

  @OneToMany(mappedBy = "diary", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<EmotionLog> emotionLogs = new ArrayList<>();

  @Column(columnDefinition = "TEXT")
  private String content;

  @Column(updatable = false)
  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

  @PrePersist
  void prePersist() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  void preUpdate(){
    this.updatedAt = LocalDateTime.now();
  }

  /*
  * 일기 생성 메서드
  * */
  public static Diary create(User user, String content){
    Diary diary = new Diary();
    diary.user = user;
    diary.content = content;
    return diary;
  }
  
  /*
  * 일기 수정 메서드
  * */
  public void updateContent(String content) {
    this.content = content;
  }

}

