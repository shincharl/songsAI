package com.example.BeatAI.service;

import com.example.BeatAI.dto.AnalyzeRequestDto;
import com.example.BeatAI.dto.AnalyzeResponseDto;
import com.example.BeatAI.entity.EmotionType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.EnumMap;
import java.util.Map;

@Service
public class EmotionAnalysisService {

  private final WebClient webClient;

  public EmotionAnalysisService(
    WebClient.Builder builder,
    @Value("${ai.server.url}") String aiBaseUrl
    ) {
    System.out.println("EmotionAnalysisService aiBaseUrl = " + aiBaseUrl);
    this.webClient = builder.baseUrl(aiBaseUrl).build();
  }

  public Map<EmotionType, Double> analyze(String text){

    Map<EmotionType, Double> result = new EnumMap<>(EmotionType.class);

    try {

      AnalyzeResponseDto res = webClient.post()
        .uri("/analyze")
        .bodyValue(new AnalyzeRequestDto(text))
        .retrieve()
        .bodyToMono(AnalyzeResponseDto.class)
        .timeout(Duration.ofSeconds(17))
        .block();

      if(res == null || res.scores() == null){
        result.put(EmotionType.NEUTRAL, 1.0);
        return result;
      }

      for (Map.Entry<String, Double> entry : res.scores().entrySet()) {
        try {
          EmotionType type = EmotionType.valueOf(entry.getKey());
          result.put(type, entry.getValue());
        } catch (IllegalArgumentException ignored) {}
      }

    } catch (Exception e) {
      // AI 서버 죽었을 때 fallback
      e.printStackTrace();
      System.out.println("❌ AI analyze 호출 실패: " + e.getMessage());
      result.put(EmotionType.NEUTRAL, 1.0);
    }

    if(result.isEmpty()){
      result.put(EmotionType.NEUTRAL, 1.0);
    }

    return  result;
  }

}
