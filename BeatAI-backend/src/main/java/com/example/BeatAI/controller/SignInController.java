package com.example.BeatAI.controller;

import com.example.BeatAI.dto.SignInRequestDto;
import com.example.BeatAI.dto.SignInResponseDto;
import com.example.BeatAI.dto.TokenDto;
import com.example.BeatAI.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class SignInController {

  private final UserService userService;

  @PostMapping("/locallogin")
  public ResponseEntity<?> locallogin(
    @RequestBody SignInRequestDto requestDto,
    HttpServletResponse response
  ){
    
    // 1. 로그인 + 토큰 생성
    TokenDto tokenDto = userService.signIn(
      requestDto.getUsername(),
      requestDto.getPassword()
    );
    
    // 2. RefreshToken 쿠키 저장
    int maxAge = requestDto.isKeepLogin()
      ? 60 * 60 * 24 * 7 // 7일
      : -1; // 브라우저 종료시 삭제

    Cookie cookie = new Cookie("refreshToken", tokenDto.getRefreshToken());
    cookie.setHttpOnly(true);
    cookie.setSecure(true);
    cookie.setPath("/");
    cookie.setMaxAge(maxAge);

    response.addCookie(cookie);

    // firstLogin 판단: 닉네임이 없으면 true
    boolean firstLogin = userService.isNicknameEmpty(requestDto.getUsername());
    // 기존 닉네임 가져오기
    String nickname = userService.getNickname(requestDto.getUsername());

    SignInResponseDto responseDto = new SignInResponseDto(
      tokenDto.getAccessToken(),
      firstLogin,
      nickname
    );

    return ResponseEntity.ok(responseDto);
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(HttpServletResponse response){

    Cookie cookie = new Cookie("refreshToken", null);
    cookie.setHttpOnly(true);
    cookie.setSecure(true);
    cookie.setPath("/");
    cookie.setMaxAge(0); // 즉시 시간 초기화

    response.addCookie(cookie);

    return ResponseEntity.ok("로그아웃 완료");
  }

}
