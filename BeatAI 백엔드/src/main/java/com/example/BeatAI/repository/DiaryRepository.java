package com.example.BeatAI.repository;

import com.example.BeatAI.entity.Diary;
import com.example.BeatAI.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface DiaryRepository extends JpaRepository<Diary, Long> {

  // 오늘 작성한 일기 시간 범위 조회 메서드
  Optional<Diary> findFirstByUserAndCreatedAtBetween(User user, LocalDateTime start, LocalDateTime end);
}
