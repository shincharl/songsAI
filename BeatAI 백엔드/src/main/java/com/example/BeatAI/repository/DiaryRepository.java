package com.example.BeatAI.repository;

import com.example.BeatAI.entity.Diary;
import com.example.BeatAI.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DiaryRepository extends JpaRepository<Diary, Long>, DiaryRepositoryCustom {

  // 오늘 작성한 일기 시간 범위 조회 메서드
  Optional<Diary> findFirstByUserAndCreatedAtBetween(User user, LocalDateTime start, LocalDateTime end);

  // 특정 날짜의 일기 1개 찾기
  List<Diary> findAllByUserAndCreatedAtBetween(User user, LocalDateTime start, LocalDateTime end);

  // 주간 감정 그래프 조회 및 정렬
  List<Diary> findAllByUserAndCreatedAtBetweenOrderByCreatedAtAsc(
    User user,
    LocalDateTime start,
    LocalDateTime end
  );
  
  // 선택한 사용자 일기 상세 검색
  Optional<Diary> findByIdAndUser(Long diaryId, User user);


}
