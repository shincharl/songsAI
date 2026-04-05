package com.example.BeatAI.repository;

import com.example.BeatAI.dto.DiaryHistoryResponse;
import com.example.BeatAI.dto.DiaryHistorySearchRequest;
import com.example.BeatAI.entity.*;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RequiredArgsConstructor
public class DiaryRepositoryImpl implements DiaryRepositoryCustom {

  private final JPAQueryFactory queryFactory;

  @Override
  public List<DiaryHistoryResponse> searchHistory(
    User user,
    LocalDateTime start,
    LocalDateTime end,
    DiaryHistorySearchRequest request
  ) {
    QDiary diary = QDiary.diary;
    QEmotionLog emotionLog = QEmotionLog.emotionLog;
    QEmotionLog emotionLogSub = new QEmotionLog("emotionLogSub");

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");

    List<Object[]> results = queryFactory
      .select(
        diary.id,
        diary.createdAt,
        diary.content,
        emotionLog.emotion
      )
      .from(diary)
      .leftJoin(emotionLog).on(
        emotionLog.diary.eq(diary),
        emotionLog.score.eq(
          JPAExpressions
            .select(emotionLogSub.score.max())
            .from(emotionLogSub)
            .where(emotionLogSub.diary.eq(diary))
        )
      )
      .where(
          diary.user.eq(user),
          diary.createdAt.goe(start),
          diary.createdAt.lt(end),
          keywordContains(request.getKeyword(), diary),
          topEmotionEq(request.getEmotion(), emotionLog)
        )
      .orderBy(diary.createdAt.desc())
      .fetch()
      .stream()
      .map(tuple -> new Object[]{
            tuple.get(diary.id),
            tuple.get(diary.createdAt),
            tuple.get(diary.content),
            tuple.get(emotionLog.emotion)
    })
      .toList();

    return results.stream()
      .map(row -> {
        Long diaryId = (Long) row[0];
        LocalDateTime createdAt = (LocalDateTime) row[1];
        String content = (String) row[2];
        EmotionType topEmotion = (EmotionType) row[3];

        return new DiaryHistoryResponse(
          diaryId,
          createdAt.format(formatter),
          topEmotion != null ? topEmotion.name() : "NEUTRAL",
          makePreview(content)
        );
      })
      .toList();
  }

  private BooleanExpression keywordContains(String keyword, QDiary diary){
    if (keyword == null || keyword.trim().isEmpty()) {
      return null;
    }
    return diary.content.containsIgnoreCase(keyword.trim());
  }

  private BooleanExpression topEmotionEq(EmotionType emotion, QEmotionLog emotionLog) {
      if (emotion == null){
        return null;
      }
      return emotionLog.emotion.eq(emotion);
  }

  private String makePreview(String content) {
    if (content == null || content.isBlank()){
      return "";
    }

    String normalized = content.replace("\n", " ").trim();
    return normalized.length() > 10
      ? normalized.substring(0, 10) + "..."
      : normalized;
  }

}
