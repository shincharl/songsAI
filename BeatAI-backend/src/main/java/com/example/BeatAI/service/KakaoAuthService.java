package com.example.BeatAI.service;

import com.example.BeatAI.config.JwtUtil;
import com.example.BeatAI.dto.KakaoUserInfoDto;
import com.example.BeatAI.dto.SignInResponseDto;
import com.example.BeatAI.entity.User;
import com.example.BeatAI.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class KakaoAuthService {

  @Value("${kakao.client-id}")
  private String kakaoClientId;

  @Value("${kakao.client-secret}")
  private String kakaoClientSecret;

  @Value("${kakao.redirect-uri}")
  private String kakaoRedirectUri;

  private final RestTemplate restTemplate = new RestTemplate();

  private final UserRepository userRepository;
  private final JwtUtil jwtUtil;


  public SignInResponseDto kakaoLogin(String code){
    String kakaoAccessToken = getKakaoAccessToken(code);
    KakaoUserInfoDto kakaoUserInfoDto = getKakaoUserInfo(kakaoAccessToken);

    User user = userRepository.findByKakaoId(kakaoUserInfoDto.getKakaoId())
      .orElseGet(() -> userRepository.save(
        User.createKakaoUser(
          kakaoUserInfoDto.getKakaoId(),
          kakaoUserInfoDto.getNickname()
        )
      ));

    String accessToken = jwtUtil.createAccessToken(user.getUsername());

    return new SignInResponseDto(
      accessToken,
      false,
      user.getNickname()
    );
  }

  public String getKakaoAccessToken(String code){
      String url = "https://kauth.kakao.com/oauth/token";

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

    MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
    body.add("grant_type", "authorization_code");
    body.add("client_id", kakaoClientId);
    body.add("redirect_uri", kakaoRedirectUri);
    body.add("code", code);
    body.add("client_secret", kakaoClientSecret);

    System.out.println("kakaoClientId = " + kakaoClientId);
    System.out.println("kakaoRedirectUri = " + kakaoRedirectUri);
    System.out.println("code = " + code);

    HttpEntity<MultiValueMap<String, String>> request =
      new HttpEntity<>(body, headers);

    ResponseEntity<Map> response =
      restTemplate.postForEntity(url, request, Map.class);

    return (String) response.getBody().get("access_token");
  }

  private KakaoUserInfoDto getKakaoUserInfo(String accessToken){
    String url = "https://kapi.kakao.com/v2/user/me";

    HttpHeaders headers = new HttpHeaders();
    headers.setBearerAuth(accessToken);

    HttpEntity<Void> request = new HttpEntity<>(headers);

    ResponseEntity<Map<String, Object>> response =
      restTemplate.exchange(url, HttpMethod.GET, request,
        new ParameterizedTypeReference<Map<String, Object>>() {});

    Map<String, Object> body = response.getBody();

    long kakaoId = ((Number) body.get("id")).longValue();

    Map<String, Object> properties =
      (Map<String, Object>) body.get("properties");

    String nickname = (String) properties.get("nickname");
    String profileImageUrl = (String) properties.get("profile_image");

    return new KakaoUserInfoDto(kakaoId, nickname, profileImageUrl);
  }
}
