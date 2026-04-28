package com.example.BeatAI.repository;

import com.example.BeatAI.dto.CategoryPlaylistResponse;
import com.example.BeatAI.dto.CategoryPlaylistVideoResponse;
import com.example.BeatAI.dto.FeaturedPlaylistQueryDto;
import com.example.BeatAI.dto.TrendingPlaylistQueryDto;
import com.example.BeatAI.entity.Diary;
import com.example.BeatAI.entity.EmotionType;
import com.example.BeatAI.entity.RecommendedVideo;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface RecommendedVideoRepository extends JpaRepository<RecommendedVideo, Long> {
  List<RecommendedVideo> findByDiaryOrderBySortOrderAsc(Diary diary);
  void deleteByDiary(Diary diary);

  @Query("""
      select new com.example.BeatAI.dto.FeaturedPlaylistQueryDto(
        rv.videoId,
        max(rv.title),
        max(rv.channelTitle),
        max(rv.thumbnailUrl),
        count(rv.id)
      )
      from RecommendedVideo rv
      join rv.diary d
      where d.createdAt >= :start
        and d.createdAt < :end
      group by rv.videoId
      order by count(rv.id) desc
    """)
  List<FeaturedPlaylistQueryDto> findFeaturedPlaylistBetween(
    @Param("start")LocalDateTime start,
    @Param("end") LocalDateTime end,
    Pageable pageable
    );

  @Query("""
      select new com.example.BeatAI.dto.TrendingPlaylistQueryDto(
        rv.videoId,
        max(rv.title),
        max(rv.channelTitle),
        max(rv.thumbnailUrl),
        count(rv.id)
      )
      from RecommendedVideo rv
      join rv.diary d
      where d.createdAt >= :start
        and d.createdAt < :end
      group by rv.videoId
      order by count(rv.id) desc
    """)
  List<TrendingPlaylistQueryDto> findTrendingPlaylistsBetween(
    @Param("start") LocalDateTime start,
    @Param("end") LocalDateTime end,
    Pageable pageable
  );

  @Query("""
      select new com.example.BeatAI.dto.CategoryPlaylistVideoResponse(
        min(rv.id),
        max(rv.title),
        max(rv.channelTitle),
        max(rv.thumbnailUrl),
        rv.videoId,
        count(rv.id)
      )
      from RecommendedVideo rv
      join rv.diary d
      join d.emotionLogs el
      where d.createdAt >= :start
        and d.createdAt < :end
        and el.emotion = :emotion
        and el.score = (
          select max(el2.score)
          from EmotionLog el2
          where el2.diary = d
        )
      group by rv.videoId
      order by count(rv.id) desc
    """)
  List<CategoryPlaylistVideoResponse> findTopVideosByEmotion(
    @Param("emotion") EmotionType emotion,
    @Param("start") LocalDateTime start,
    @Param("end") LocalDateTime end,
    Pageable pageable
    );
}
