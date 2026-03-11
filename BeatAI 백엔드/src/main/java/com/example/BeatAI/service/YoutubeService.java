package com.example.BeatAI.service;

import com.example.BeatAI.dto.YoutubeVideoItemResponse;

import java.util.List;

public interface YoutubeService {

  List<YoutubeVideoItemResponse> searchVideos(String query);
}
