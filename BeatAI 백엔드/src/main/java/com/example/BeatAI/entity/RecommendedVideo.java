package com.example.BeatAI.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
public class RecommendedVideo {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "DIARY_ID", nullable = false)
  private Diary diary;

  private String videoId;

  @Column(columnDefinition = "TEXT")
  private String title;

  private String channelTitle;

  @Column(columnDefinition = "TEXT")
  private String thumbnailUrl;

  private Integer sortOrder;

  public static RecommendedVideo create(
    Diary diary,
    String videoId,
    String title,
    String channelTitle,
    String thumbnailUrl,
    Integer sortOrder
  ){
    RecommendedVideo video = new RecommendedVideo();
    video.diary = diary;
    video.videoId = videoId;
    video.title = title;
    video.channelTitle = channelTitle;
    video.thumbnailUrl = thumbnailUrl;
    video.sortOrder = sortOrder;
    return video;
  }
}
