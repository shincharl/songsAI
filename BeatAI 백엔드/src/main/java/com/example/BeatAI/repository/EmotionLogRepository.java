package com.example.BeatAI.repository;

import com.example.BeatAI.entity.Diary;
import com.example.BeatAI.entity.EmotionLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmotionLogRepository extends JpaRepository<EmotionLog, Long> {
    void deleteByDiary(Diary diary);
}
