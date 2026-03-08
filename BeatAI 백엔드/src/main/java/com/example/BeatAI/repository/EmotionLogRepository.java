package com.example.BeatAI.repository;

import com.example.BeatAI.entity.Diary;
import com.example.BeatAI.entity.EmotionLog;
import com.example.BeatAI.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EmotionLogRepository extends JpaRepository<EmotionLog, Long> {
    void deleteByDiary(Diary diary);
    
    // 최근 날짜 기준 감정 로그 조회 (7일)
    List<EmotionLog> findByDiaryUserAndDiaryCreatedAtAfter(
      User user,
      LocalDateTime date
    );
    
    // 각 diary의 최고 감정 가져오기
    Optional<EmotionLog> findTopByDiaryOrderByScoreDesc(Diary diary);
  
}
