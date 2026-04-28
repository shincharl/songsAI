package com.example.BeatAI.controller;

import com.example.BeatAI.dto.KakaoUserInfoDto;
import com.example.BeatAI.dto.SignInResponseDto;
import com.example.BeatAI.service.KakaoAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class KakaoAuthController {

  private final KakaoAuthService kakaoAuthService;

  @Value("${app.frontend-url}")
  private String frontendUrl;

  @GetMapping("/kakao/callback")
  public ResponseEntity<Void> kakaoCallback(@RequestParam String code){
    log.info("카카오 인가 코드 = {}", code);

    SignInResponseDto response = kakaoAuthService.kakaoLogin(code);

    String redirectUrl =
      frontendUrl
        + "/oauth/kakao/success"
        + "?accessToken=" + response.getAccessToken()
        + "&nickname=" + URLEncoder.encode(response.getNickname(), StandardCharsets.UTF_8);

    return ResponseEntity
      .status(HttpStatus.FOUND)
      .header(HttpHeaders.LOCATION, redirectUrl)
      .build();
  }
}
