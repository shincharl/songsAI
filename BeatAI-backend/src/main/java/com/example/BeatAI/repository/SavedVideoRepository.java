package com.example.BeatAI.repository;

import com.example.BeatAI.entity.SavedVideo;
import com.example.BeatAI.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedVideoRepository extends JpaRepository<SavedVideo, Long> {

  List<SavedVideo> findByUserOrderByCreatedAtDesc(User user);

  boolean existsByUserAndVideoId(User user, String videoId);

  void deleteByUserAndVideoId(User user, String videoId);

}
