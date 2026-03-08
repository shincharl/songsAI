package com.example.BeatAI.repository;

import com.example.BeatAI.entity.Diary;
import com.example.BeatAI.entity.DiarySticker;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiaryStickerRepository extends JpaRepository<DiarySticker, Long> {

    void deleteByDiary(Diary diary);

  List<DiarySticker> findByDiary(Diary diary);
}
