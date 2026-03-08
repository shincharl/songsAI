package com.example.BeatAI.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
public class DiarySticker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;
    private String label;

    @Column(length = 1000)
    private String img;

    private Integer page;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diary_id")
    private Diary diary;

    public static DiarySticker create(
      Diary diary,
      String category,
      String label,
      String img,
      Integer page
    ){
      DiarySticker sticker = new DiarySticker();
      sticker.diary = diary;
      sticker.category = category;
      sticker.label = label;
      sticker.img = img;
      sticker.page = page;
      return sticker;
    }
}
