package com.example.BeatAI.controller;

import com.example.BeatAI.dto.SignInResponseDto;
import com.example.BeatAI.dto.TokenDto;
import com.example.BeatAI.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class TokenController {

    private final UserService userService;

    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {

      // 1. 쿠키에서 refreshToken 가져오기
      Cookie[] cookies = request.getCookies();
      String refreshToken = null;
      if (cookies != null) {
        for (Cookie cookie : cookies) {
          if ("refreshToken".equals(cookie.getName())) {
            refreshToken = cookie.getValue();
            break;
          }
        }
      }

      if (refreshToken == null) {
        return ResponseEntity.status(401).body("RefreshToken 없음");
      }

      // 2. RefreshToken 검증 후 AccessToken 재발급
      TokenDto tokenDto = userService.reissueAccessToken(refreshToken);
      if (tokenDto == null) {
        return ResponseEntity.status(401).body("RefreshToken 만료 또는 유효하지 않음");
      }

      // 3. nickname 조회
      String username = tokenDto.getUsername();
      String nickname = userService.getNickname(username);

      return ResponseEntity.ok(new SignInResponseDto(
        tokenDto.getAccessToken(),
        false,
        nickname
      ));
    }
}
