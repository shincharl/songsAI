package com.example.BeatAI.service;

import com.example.BeatAI.dto.SavedVideoRequest;
import com.example.BeatAI.dto.SavedVideoResponse;
import com.example.BeatAI.entity.SavedVideo;
import com.example.BeatAI.entity.User;
import com.example.BeatAI.repository.SavedVideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SavedVideoService {

  private final SavedVideoRepository savedVideoRepository;

  public void save(User user, SavedVideoRequest request){
    boolean exists = savedVideoRepository.existsByUserAndVideoId(
      user,
      request.getVideoId()
    );

    if (exists){
      return;
    }

    SavedVideo savedVideo = SavedVideo.builder()
      .user(user)
      .videoId(request.getVideoId())
      .title(request.getTitle())
      .channelTitle(request.getChannelTitle())
      .thumbnailUrl(request.getThumbnailUrl())
      .build();

    savedVideoRepository.save(savedVideo);
  }

  public void delete(User user, String videoId){
    savedVideoRepository.deleteByUserAndVideoId(user, videoId);
  }

  @Transactional(readOnly = true)
  public List<SavedVideoResponse> getMySavedVideos(User user){
    return savedVideoRepository.findByUserOrderByCreatedAtDesc(user)
      .stream()
      .map(video -> SavedVideoResponse.builder()
        .id(video.getId())
        .videoId(video.getVideoId())
        .title(video.getTitle())
        .channelTitle(video.getChannelTitle())
        .thumbnailUrl(video.getThumbnailUrl())
        .build())
      .toList();
  }
}
