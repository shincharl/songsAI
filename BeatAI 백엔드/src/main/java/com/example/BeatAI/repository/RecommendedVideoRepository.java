package com.example.BeatAI.repository;

import com.example.BeatAI.entity.Diary;
import com.example.BeatAI.entity.RecommendedVideo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecommendedVideoRepository extends JpaRepository<RecommendedVideo, Long> {
  List<RecommendedVideo> findByDiaryOrderBySortOrderAsc(Diary diary);
  void deleteByDiary(Diary diary);
}
